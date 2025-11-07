let pokedex = [];

const list = (req, res) => {
  res.render("pokedex", { pokedex });
};

const save = (req, res) => {
  const { nombre, tipo, peso, shiny, oscuro, imagen } = req.body;

  pokedex.push({
    nombre,
    tipo,
    peso,
    shiny,
    oscuro,
    imagen
  });

  res.redirect("/pokedex");
};

module.exports = { list, save };
