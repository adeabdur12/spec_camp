import * as PackageEventService from '../services/PackageEventService.js';

export const getAllPackages = async (req, res) => {
  try {
    const packages = await PackageEventService.getAllPackages();
    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const pkg = await PackageEventService.getPackageById(req.params.id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Paket tidak ditemukan'
      });
    }
    res.json({
      success: true,
      data: pkg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createPackage = async (req, res) => {
  try {
    const pkg = await PackageEventService.createPackage(req.body);
    res.status(201).json({
      success: true,
      message: 'Paket berhasil dibuat',
      data: pkg
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const pkg = await PackageEventService.updatePackage(req.params.id, req.body);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Paket tidak ditemukan'
      });
    }
    res.json({
      success: true,
      message: 'Paket berhasil diperbarui',
      data: pkg
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const deleted = await PackageEventService.deletePackage(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Paket tidak ditemukan'
      });
    }
    res.json({
      success: true,
      message: 'Paket berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPackagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const packages = await PackageEventService.getPackagesByCategory(category);
    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};