import mongoose from 'mongoose';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@])[A-Za-z\d#\$%&*@]{8,}$/;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (typeof v === 'string' && v.startsWith('$2')) return true;
          return passwordRegex.test(v);
        },
        message:
          'El password debe tener mínimo 8 caracteres, 1 mayúscula, 1 dígito y 1 caracter especial (# $ % & * @).'
      }
    },
    phoneNumber: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    url_profile: { type: String, default: '' },
    adress: { type: String, default: '' },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  },
  { timestamps: true }
);

// Virtual para obtener los nombres de los roles poblados
UserSchema.virtual('roleNames').get(function () {
  if (!this.roles) return [];
  // Si roles están poblados, devuelve los nombres
  return this.roles.map(r => r.name || r);
});

export default mongoose.model('User', UserSchema);