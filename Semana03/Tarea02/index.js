const http = require('http');
const { generarExcel } = require('./excel');

const server = http.createServer(async (req, res) => {
  if (req.url === '/reporte') {
    try {
      const workbook = await generarExcel();
      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="reporte.xlsx"'
      });
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error al generar el Excel');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Visita /reporte para descargar el Excel');
  }
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
