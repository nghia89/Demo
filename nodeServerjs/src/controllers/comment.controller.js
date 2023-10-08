'use strict'

const { OK, CREATED } = require("../core/success.response")
const CommentService = require("../services/comment.service")


class CommentController {

    CreateComment = async (req, res, next) => {
        new OK({
            message: 'Create comment Ok',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    GetComment = async (req, res, next) => {
        new OK({
            message: 'Get comment Ok',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    DeleteComment = async (req, res, next) => {
        new OK({
            message: 'Delete comment Ok',
            metadata: await CommentService.deleteComment(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()