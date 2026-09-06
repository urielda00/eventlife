package com.example.eventlife.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard API response wrapper")
public class BaseResponse {

    @Schema(description = "Indicates if the request was successful", example = "true")
    private boolean success;

    @Schema(description = "A descriptive message about the response", example = "User registered successfully")
    private String message;

    @Schema(description = "The response body, can be an object or list depending on the request")
    private Object resBody;

    @Schema(description = "HTTP status code of the response", example = "200")
    private int status;

    public BaseResponse(boolean success, String message, Object resBody, int status) {
        this.success = success;
        this.message = message;
        this.resBody = resBody;
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Object getResBody() {
        return resBody;
    }

    public int getStatus() {
        return status;
    }
}