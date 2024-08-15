module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    activeFlag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // isAlphanumeric: {
        //   msg: 'Password must contain only letters and numbers',
        // },
        len: {
          args: [8],
          msg: 'Password must be at least 8 characters long',
        },
      },
    },

    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: 'Mobile number must be a valid 10 digit number',
        },
      },
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  })
  return Users
}
