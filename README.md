# ticket-caisse

### base de données

Il y a 2 scripts:

- un premier qui serait celui à utiliser en cas réel
- un deuxième pour tester la montée en charge (pas de PK sur `ticket` & `product` pour permettre les doublons)

### choix des libs

- j'ai fait au plus simple, c'est à dire en utilisant (presque) le minimum de dépendances possibles
- pour l'accès en BDD, j'utilise simplement pg, pas besoin d'orm pour un si petit projet
- utilisation de ExpressJS pour implémenter les controllers, inutile d'utiliser un framework plus complet (donc plus gros et potentiellement moins performant) ici puisqu'on veut optimiser les perfs.
- j'ai opté pour l'utilisation de csv-parse pour transformer le bloc csv en objet typescript, simple d'utilisation et évite d'avoir à implémenter un parser

### structure

- style fonctional programming
- traitements regroupés par type de données:
    - `raw-ticket` => représente le ticket reçu sous forme de texte, nécessaire car on veut toujours enregistrer le ticket brut en bdd avant de faire quoi que ce soit
    - `ticket` => représente l'entité ticket
    - `product` => représente les produits extraits du ticket
- les différents type de données sont représentés par des fichiers `.ts` car il y a peu de code à écrire ici.
- si l'appli venait à grossir il faudrait découper autrement en utilisant une arborescence de répertoires, lesquels contiendraient repository, model, service et controller pour chaque type de données par exemple. Il serait aussi intéressant
  d'utiliser un orm pour simplifier les accès bdd.
