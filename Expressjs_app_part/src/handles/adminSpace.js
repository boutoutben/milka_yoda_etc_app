const db = require("../mysqlDatabase.js");

const fetchAdoptionNotApprouved = async (req, res) => {
    try {
      const [animals] = await db.promise().query(
        "SELECT adopter.id, animals.id as animalId, name, description, isSterile, imgName, isMediator, races, born, incompatibility, createdAt, isApprouved FROM adopter INNER JOIN animals ON animals.id = adopter.animal_id WHERE !isApprouved"
      );
      res.status(200).json(animals);
    } catch (error) {
      res.status(500).json({ error: `Erreur serveur: ${error.message}` });
    }
  }

const fetchApprouveAdoption = async (req, res) => {
    const {id} = req.params;
    try {
    const [row] = await db.promise().query(
      "SELECT adopter.id AS adopterId,firstname, lastname, civility, adressePostale, email, phone,animalCase, animalNumber, otherAnimals, lifeRoutine, haveChildren, motivation, animalPlace, child,animals.id AS animalId,name, description, isSterile, imgName, isMediator, races, born, incompatibility, createdAt, isApprouved FROM adopter INNER JOIN animals ON animals.id = adopter.animal_id WHERE adopter.id = ?",
      [id]
    );
    const data = row[0];
    const values = {
      id: data.adopterId,
      firstname: data.firstname,
      lastname: data.lastname,
      civility: data.civility,
      adressePostale: data.adressePostale,
      email: data.email,
      phone: data.phone,
      animalCase: JSON.parse(data.animalCase),
      animalNumber: JSON.parse(data.animalNumber),
      otherAnimals: JSON.parse(data.otherAnimals),
      lifeRoutine: JSON.parse(data.lifeRoutine),
      haveChildren: data.haveChildren,
      motivation: data.motivation,
      animalPlace: JSON.parse(data.animalPlace),
      child: JSON.parse(data.child)
    };

    const animal = {
      id: data.animalId,
      name: data.name,
      description: data.description,
      isSterile: data.isSterile,
      imgName: data.imgName,
      isMediator: data.isMediator,
      races: data.races,
      born: data.born,
      incompatibility: data.incompatibility,
      createdAt: data.createdAt,
      isApprouved: data.isApprouved
    };
    res.status(200).json({animal, values});
  } catch (error) {
    res.status(500).json({ error: `Erreur serveur: ${error.message}` });
  }
}

const deleteAdoptionNotApprouved = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.promise().query(
            "SELECT animal_id FROM adopter WHERE id = ?",
            [id]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({error:"Nous n'avons pas trouvé les données"});
        }

        const animalId = rows[0].animal_id;

        await db.promise().query("UPDATE animals SET isAdopted = false WHERE id = ?", [animalId]);
        await db.promise().query("DELETE FROM adopter WHERE id = ?", [id]);

        res.status(200).json({ message: "Adoption refusée" });  
    } catch (err) {
        res.status(500).json({ error: `Erreur serveur: ${err.message}` });
    }
};

const approuveAdoption = async (req, res) => {
    try {
        const {id} = req.params;
        await db.promise().query("UPDATE adopter SET isApprouved=true WHERE id = ?", [id]);
        res.status(200).json({message: "Adoption acceptée"});    
    } catch (err) {
        res.status(500).json({error: `Erreur serveur: ${err.message}`})
    }
  }

const fetchAllUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query(
            "SELECT users.id, firstname, lastname, email, isBlock FROM users INNER JOIN roles ON users.role = roles.id WHERE roles.name = 'USER_ROLE'"
        );
        res.status(200).json({users});
    } catch (err) {
        res.status(500).json({error: `Erreur serveur: ${err.message}`})
    }
  }

  const blockUpdate = async (req, res) => {
    try {
        const {id, argument} = req.body;
        await db.promise().query("UPDATE users set isBlock=? WHERE users.id = ?", [argument, id]);
        res.status(200).json({message: "Update"});      
    } catch (err) {
        res.status(500).json({error: `Erreur serveur: ${err.message}`})
    }
   
  }

  module.exports = {
    fetchAdoptionNotApprouved,
    fetchApprouveAdoption,
    approuveAdoption,
    deleteAdoptionNotApprouved,
    fetchAllUsers,
    blockUpdate
  }