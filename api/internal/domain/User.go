package domain

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"` // hashed password
	Salt     string `json:"salt"`     // salt used for the hash
	UserRole string `json:"userRole"`
}

type UserUpdatePassword struct {
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}
