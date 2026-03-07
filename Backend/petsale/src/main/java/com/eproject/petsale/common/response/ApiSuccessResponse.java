package com.eproject.petsale.common.response;

public class ApiSuccessResponse<T> {

    private int status;
    private String message;
    private T data;

    public ApiSuccessResponse(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
}