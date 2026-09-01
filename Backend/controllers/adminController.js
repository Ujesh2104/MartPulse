const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} = require('../utils/validators');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    const statsObj = {
      totalUsers,
      totalStores,
      totalRatings,
    };

    return res.status(200).json({
      success: true,
      stats: statsObj,
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Admin get stats error:', error);
    return res.status(500).json({ message: 'Failed to retrieve system statistics.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search = '', role = '', sort = '' } = req.query;

    const whereClause = {};

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { name: { [Op.like]: q } },
        { email: { [Op.like]: q } },
        { address: { [Op.like]: q } },
        { role: { [Op.like]: q } },
      ];
    }

    if (role && role !== 'All' && role !== 'ALL') {
      whereClause.role = role.toUpperCase();
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'name_asc') {
      order = [['name', 'ASC']];
    } else if (sort === 'name_desc') {
      order = [['name', 'DESC']];
    } else if (sort === 'email_asc') {
      order = [['email', 'ASC']];
    } else if (sort === 'email_desc') {
      order = [['email', 'DESC']];
    } else if (sort === 'role_asc') {
      order = [['role', 'ASC']];
    } else if (sort === 'role_desc') {
      order = [['role', 'DESC']];
    } else if (sort === 'address_asc') {
      order = [['address', 'ASC']];
    } else if (sort === 'address_desc') {
      order = [['address', 'DESC']];
    }

    const users = await User.findAll({
      where: whereClause,
      order,
      attributes: ['id', 'name', 'email', 'role', 'address', 'createdAt'],
    });

    const stores = await Store.findAll();
    const enrichedUsers = users.map((u) => {
      const uJson = u.toJSON();
      if (uJson.role === 'STORE_OWNER') {
        const ownerStore = stores.find(
          (s) => s.ownerId === uJson.id || (s.email && s.email.toLowerCase() === uJson.email.toLowerCase())
        );
        if (ownerStore) {
          uJson.storeRating = ownerStore.rating;
          uJson.storeName = ownerStore.name;
        }
      }
      return uJson;
    });

    return res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({ message: 'Failed to retrieve users list.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role = 'NORMAL_USER' } = req.body;

    const nameCheck = validateName(name);
    if (!nameCheck.isValid) return res.status(400).json({ message: nameCheck.message });

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) return res.status(400).json({ message: emailCheck.message });

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) return res.status(400).json({ message: passCheck.message });

    const addrCheck = validateAddress(address);
    if (!addrCheck.isValid) return res.status(400).json({ message: addrCheck.message });

    const validRoles = ['ADMIN', 'STORE_OWNER', 'NORMAL_USER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const existingUser = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      address: address.trim(),
      role: role,
    });

    return res.status(201).json({
      success: true,
      message: `User created successfully with role ${role}.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address,
      },
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    return res.status(500).json({ message: 'Failed to create user.' });
  }
};

module.exports = {
  getStats,
  getUsers,
  createUser,
};
