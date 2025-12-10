const UserRepository = require("../repository/UserRepository");
const bcrypt = require("bcrypt");
const {
    InvalidRequestException,
    NotFoundException,
} = require("../utils/Exception");

const MessageConstant = require("../constant/MessageConstant");

class UserService {
    // Create User
    async addUser(data) {
        // validate data
        if (!data)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST_DESCRIPTION,
            );
        // convert password in becrypt
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        // store data into and return it
        return await UserRepository.addUser(data);
    }

    // Login User
    async loginUser(data) {
        const { email, password, role } = data;

        // Validation
        if (!email || !password || !role) {
            throw new InvalidRequestException("All fields are required");
        }

        // Get user by email
        const user = await UserRepository.loginUser(email);
        if (!user) {
            throw new InvalidRequestException(
                "User does not exist with this email",
            );
        }

        // Role mismatch
        if (user.role !== role) {
            throw new InvalidRequestException("Role mismatch");
        }

        // Password check (plain text in your DB)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new InvalidRequestException("Incorrect password");
        }

        // Success return — do NOT return success:true (controller handles success)
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    // Get user by ID
    async getUserById(id) {
        if (!id)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST_DESCRIPTION,
            );

        const user = await UserRepository.getUserById(id);

        if (!user) {
            throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
        }

        return user;
    }

    // Update User
    async updateUserById(id, data) {
        if (!id || !data)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST_DESCRIPTION,
            );

        const updated = await UserRepository.updateUserById(id, data);

        // Sequelize update returns: [count, [updatedObject]]
        return updated[1]?.[0] || null;
    }

    // Soft Delete User
    async deleteUserById(id) {
        if (!id)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST_DESCRIPTION,
            );

        return await UserRepository.deleteUserById(id);
    }

    async getAllUsers() {
        return await UserRepository.getAllUsers();
    }
}

module.exports = new UserService();
