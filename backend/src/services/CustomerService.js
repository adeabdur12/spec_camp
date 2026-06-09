import db from '../models/index.js';
const { Customer, Booking } = db;

export const getAllCustomers = async () => {
  return await Customer.findAll({
    include: [{
      model: Booking,
      attributes: ['id', 'totalPrice', 'status', 'checkInDate', 'checkOutDate', 'createdAt']
    }],
    order: [['createdAt', 'DESC']]
  });
};

export const getCustomerById = async (id) => {
  return await Customer.findByPk(id, {
    include: [{
      model: Booking,
      attributes: ['id', 'totalPrice', 'status', 'checkInDate', 'checkOutDate', 'createdAt']
    }]
  });
};

export const createCustomer = async (data) => {
  const [customer, created] = await Customer.findOrCreate({
    where: { email: data.email },
    defaults: data
  });
  return customer;
};

export const updateCustomer = async (id, data) => {
  const customer = await Customer.findByPk(id);
  if (!customer) return null;
  await customer.update(data);
  return await getCustomerById(id);
};

export const deleteCustomer = async (id) => {
  const customer = await Customer.findByPk(id);
  if (!customer) return false;
  await Booking.update({ customerId: null }, { where: { customerId: id } });
  await customer.destroy();
  return true;
};

export const searchCustomers = async (query) => {
  const { Op } = db.Sequelize;
  return await Customer.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${query}%` } },
        { email: { [Op.like]: `%${query}%` } },
        { phone: { [Op.like]: `%${query}%` } }
      ]
    },
    include: [{
      model: Booking,
      attributes: ['id', 'totalPrice', 'status', 'checkInDate', 'checkOutDate', 'createdAt']
    }],
    order: [['createdAt', 'DESC']],
    limit: 20
  });
};
