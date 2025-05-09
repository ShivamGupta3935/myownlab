class ApiResponse{
    constructor(statusCode, data={}, message="successful"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
    }
}

export {ApiResponse}