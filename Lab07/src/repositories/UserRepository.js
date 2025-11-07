import User from '../models/User.js';

class UserRepository {
  findAll() {
    return User.find().populate('roles', 'name'); 
    // populate: trae solo el campo name del rol
  }

  findById(id) {
    return User.findById(id).populate('roles', 'name');
  }

  findByEmail(email) {
    return User.findOne({ email }).populate('roles', 'name');
  }

  create(data) {
    return User.create(data);
  }
}

export default new UserRepository();

