'use strict';

class User {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });
    return user;
  }

  async createUser(data) {
    const newUser = await this._User.create(data);
    return newUser;
  }
}

module.exports = User;
