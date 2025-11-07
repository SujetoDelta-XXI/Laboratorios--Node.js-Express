const ExcelJS = require('exceljs');

async function generarExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ventas');

  worksheet.columns = [
    { header: 'Producto', key: 'producto', width: 25 },
    { header: 'Cantidad', key: 'cantidad', width: 15 },
    { header: 'Precio', key: 'precio', width: 15 }
  ];

  const ventas = [
    { producto: 'Laptop Lenovo IdeaPad 3', cantidad: 5, precio: 2300.50 },
    { producto: 'Mouse Logitech M170', cantidad: 12, precio: 45.90 },
    { producto: 'Teclado Mecánico Redragon', cantidad: 7, precio: 150.00 },
    { producto: 'Monitor Samsung 24"', cantidad: 4, precio: 750.99 },
    { producto: 'Impresora HP DeskJet 2135', cantidad: 3, precio: 399.90 },
    { producto: 'Disco Duro Externo 1TB Seagate', cantidad: 9, precio: 280.00 },
    { producto: 'Memoria USB 32GB Kingston', cantidad: 20, precio: 35.00 },
    { producto: 'Audífonos Sony WH-1000XM4', cantidad: 2, precio: 1250.00 },
    { producto: 'Silla Gamer Cougar Armor One', cantidad: 6, precio: 899.90 },
    { producto: 'Router TP-Link Archer C6', cantidad: 10, precio: 180.00 },
    { producto: 'Tablet Samsung Galaxy Tab A7', cantidad: 4, precio: 1200.00 },
    { producto: 'Smartwatch Amazfit Bip U Pro', cantidad: 8, precio: 299.90 },
    { producto: 'Cámara Logitech C920 HD Pro', cantidad: 5, precio: 399.00 },
    { producto: 'Parlante JBL Flip 5', cantidad: 6, precio: 450.00 },
    { producto: 'Fuente de Poder EVGA 600W', cantidad: 3, precio: 320.00 },
    { producto: 'Tarjeta Gráfica NVIDIA GTX 1660', cantidad: 2, precio: 1350.00 },
    { producto: 'MicroSD 128GB Sandisk', cantidad: 15, precio: 120.00 },
    { producto: 'Lámpara LED Escritorio Xiaomi', cantidad: 10, precio: 89.90 },
    { producto: 'Cargador Universal Laptop', cantidad: 7, precio: 150.00 },
    { producto: 'SSD NVMe 1TB Western Digital', cantidad: 4, precio: 480.00 }
  ];

  ventas.forEach(venta => worksheet.addRow(venta));

  return workbook;
}

module.exports = { generarExcel };
