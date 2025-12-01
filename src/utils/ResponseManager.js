class ResponseManager {

    static send(res, meta, data = null) {
        return res.status(meta.code).json({
            status: meta.status,
            code: meta.code,
            description: meta.description,
            data: data
        });
    }

    static GeneralResponse(res, data, meta) {
        return this.send(res, meta, data);
    }

    static ok(message) {
        return { code: 200, status: "OK", description: message };
    }

    static created(message) {
        return { code: 201, status: "Created", description: message };
    }

    static updated(message) {
        return { code: 200, status: "Updated", description: message };
    }

    static deleted(message) {
        return { code: 200, status: "Deleted", description: message };
    }

    static error(statusCode, message) {
        return { code: statusCode, status: "Error", description: message };
    }
}

module.exports = ResponseManager;
