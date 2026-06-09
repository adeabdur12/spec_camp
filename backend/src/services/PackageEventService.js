import db from '../models/index.js';
const { PackageEvent } = db;

export const getAllPackages = async () => {
  return await PackageEvent.findAll({
    order: [['createdAt', 'DESC']]
  });
};

export const getPackageById = async (id) => {
  return await PackageEvent.findByPk(id);
};

export const createPackage = async (data) => {
  const pkg = await PackageEvent.create(data);
  return pkg;
};

export const updatePackage = async (id, data) => {
  const pkg = await PackageEvent.findByPk(id);
  if (!pkg) return null;
  await pkg.update(data);
  return pkg;
};

export const deletePackage = async (id) => {
  const pkg = await PackageEvent.findByPk(id);
  if (!pkg) return false;
  await pkg.destroy();
  return true;
};

export const getPackagesByCategory = async (category) => {
  return await PackageEvent.findAll({
    where: { category, isActive: true },
    order: [['pricePerPax', 'ASC']]
  });
};