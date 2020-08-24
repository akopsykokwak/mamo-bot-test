const jobs = {
  Marauder: "Maraudeur",
  Warrior: "Guerrier",
  Gladiator: "Gladiateur",
  Paladin: "Paladin",
  Lancer: "Lancier",
  Dragoon: "Chevalier Dragon",
  Pugilist: "Pugiliste",
  Monk: "Moine",
  Rogue: "Surineur",
  Ninja: "Ninja",
  Archer: "Archer",
  Bard: "Barde",
  Thaumaturge: "Occultiste",
  BlackMage: "Mage Noir",
  Arcanist: "Arcaniste",
  Summoner: "Invocateur",
  Scholar: "Erudit",
  Conjurer: "Elémentaliste",
  WhiteMage: "Mage Blanc",
  BlueMageLimitedJob: "Mage Bleu",
  DarkKnight: "Chevalier Noir",
  Astrologian: "Astromancien",
  Machinist: "Machiniste",
  Samurai: "Samourai",
  RedMage: "Mage Rouge",
  Gunbreaker: "Pistosabreur",
  Dancer: "Danseur",
  Alchemist: "Alchimiste",
  Armorer: "Armurier",
  Blacksmith: "Forgeron",
  Carpenter: "Menuisier",
  Culinarian: "Cuisinier",
  Goldsmith: "Orfèvre",
  Leatherworker: "Tanneur",
  Weaver: "Couturier",
  Botanist: "Botaniste",
  Fisher: "Pêcheur",
  Miner: "Mineur"
}

module.exports.findFrJob = function (string) {
  let str = string.replace(/\s/g, '');
  if(str.includes('(')) str = str.replace(/[()]/g, '');
  let title;
  Object.keys(jobs)
  .map(job => {
    if(job === str) title = jobs[job]
    else return;
  })
  return title;
}

