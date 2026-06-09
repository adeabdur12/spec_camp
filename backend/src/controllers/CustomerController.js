import * as CustomerService from '../services/CustomerService.js';

export const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const data = search
      ? await CustomerService.searchCustomers(search)
      : await CustomerService.getAllCustomers();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await CustomerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = await CustomerService.createCustomer(req.body);
    res.status(201).json({ success: true, message: 'Customer created', data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await CustomerService.updateCustomer(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer updated', data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await CustomerService.deleteCustomer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
