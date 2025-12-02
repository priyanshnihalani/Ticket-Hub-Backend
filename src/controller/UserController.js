const UserService = require("../service/UserService");
const ResponseManager = require("../utils/ResponseManager");
const MessageConstant = require("../constant/MessageConstant");
const {
    getOkResponse,
    getCreatedResponse,
    getUpdatedResponse,
    getDeletedResponse,
} = require("../utils/Response");

class UserController {
    // Create User
    addUser = async (req, res, next) => {
        try {
            const result = await UserService.addUser(req.body);
            const meta = getCreatedResponse(
                MessageConstant.USER_ADDED_SUCCESSFULLY,
            );
            return ResponseManager.send(res, meta, result);
        } catch (error) {
            next(error);
        }
    };

    // Login User
    loginUser = async (req, res, next) => {
        try {
            const result = await UserService.loginUser(req.body);

            const meta = getOkResponse(MessageConstant.LOGIN_SUCCESS);
            return ResponseManager.send(res, meta, result);
        } catch (error) {
            next(error);
        }
    };

    // Get User by ID
    getUserById = async (req, res, next) => {
        try {
            const result = await UserService.getUserById(req.params.id);
            const meta = getOkResponse(MessageConstant.SUCCESS);
            return ResponseManager.send(res, meta, result);
        } catch (error) {
            next(error);
        }
    };

    // Update User
    updateUserById = async (req, res, next) => {
        try {
            const result = await UserService.updateUserById(
                req.params.id,
                req.body,
            );

            const meta = getUpdatedResponse(
                MessageConstant.USER_UPDATED_SUCCESSFULLY,
            );
            return ResponseManager.send(res, meta, result);
        } catch (error) {
            next(error);
        }
    };

    deleteUserById = async (req, res, next) => {
        try {
            const result = await UserService.deleteUserById(req.params.id);

            const meta = getDeletedResponse(
                MessageConstant.USER_DELETED_SUCCESSFULLY,
            );
            return ResponseManager.send(res, meta, result);
        } catch (error) {
            next(error);
        }
    };

    getAllUsers = async (_, res, next) => {
        try {
            const result = await UserService.getAllUsers();
            const meta = getOkResponse(
                MessageConstant.USERS_FOUND_SUCCESSFULLY,
            );
            return ResponseManager.send(res, meta, result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserController();
