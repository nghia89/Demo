'use strict'


const { NotFoundError } = require("../core/error.response")
const Comment = require("../models/comment.model")
const { stringToObjectId } = require('../utils/index')
const { findProduct } = require("./product.service")

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        let rightValue
        if (parentCommentId) {
            //replay comment
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) throw new NotFoundError('parent comment not found ')
            rightValue = parentComment.comment_right
            //update many comment
            await Comment.updateMany({
                comment_productId: stringToObjectId(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: stringToObjectId(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {
            const maxRightValue = await Comment.findOne(
                { comment_productId: stringToObjectId(productId) },
                'comment_right', { sort: { comment_right: -1 } })
            if (maxRightValue) {
                rightValue = maxRightValue + 1
            } else {
                rightValue = 1
            }
        }
        //insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()
        return comment;
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId,
        limit = 50,
        offset = 0
    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId)
            if (!parent) throw new NotFoundError('parent comment not found')
            const comments = await Comment.find({
                comment_productId: stringToObjectId(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            }).sort({ comment_left: -1 })
            return comments;
        }
        const comments = await Comment.find({
            comment_productId: stringToObjectId(productId),
            comment_parentId: parentCommentId
        }).sort({ comment_left: -1 })
        return comments;
    }


    static async deleteComment({ commentId, productId }) {
        const product = await findProduct({ product_id: productId });
        console.log(productId)
        if (!product) throw new NotFoundError('Product not found')
        const comment = await Comment.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found')
        let leftValue = comment.comment_left
        let rightValue = comment.comment_right

        const withValue = rightValue - leftValue + 1
        await Comment.deleteMany({
            comment_productId: stringToObjectId(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })

        await Comment.updateMany({
            comment_productId: stringToObjectId(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -withValue }
        })

        await Comment.updateMany({
            comment_productId: stringToObjectId(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_left: -withValue }
        })
        return true;
    }
}

module.exports = CommentService