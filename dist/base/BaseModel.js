"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    constructor(data) {
        this.id = data.id || data._id;
        if (data.createdAt) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.updatedAt) {
            this.updatedAt = new Date(data.createdAt);
        }
    }
}
exports.default = BaseModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZU1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2Jhc2UvQmFzZU1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0E7SUFLRSxZQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7UUFFOUIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztDQUNGO0FBZkQsNEJBZUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIEJhc2VNb2RlbFNjaGVtYSB7XG4gIGlkPzogc3RyaW5nO1xuICBfaWQ/OiBzdHJpbmc7XG4gIGNyZWF0ZWRBdD86IHN0cmluZyB8IERhdGU7XG4gIHVwZGF0ZWRBdD86IHN0cmluZyB8IERhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VNb2RlbCB7XG4gIGlkPzogc3RyaW5nO1xuICBjcmVhdGVkQXQ/OiBEYXRlO1xuICB1cGRhdGVkQXQ/OiBEYXRlO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueSkge1xuICAgIHRoaXMuaWQgPSBkYXRhLmlkIHx8IGRhdGEuX2lkO1xuXG4gICAgaWYgKGRhdGEuY3JlYXRlZEF0KSB7XG4gICAgICB0aGlzLmNyZWF0ZWRBdCA9IG5ldyBEYXRlKGRhdGEuY3JlYXRlZEF0KTtcbiAgICB9XG4gICAgaWYgKGRhdGEudXBkYXRlZEF0KSB7XG4gICAgICB0aGlzLnVwZGF0ZWRBdCA9IG5ldyBEYXRlKGRhdGEuY3JlYXRlZEF0KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==