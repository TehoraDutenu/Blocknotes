const STORAGE_NAME = 'notabene';

// export = Permet d'utiliser la class dans d'autre fichier
// default = recuperer seulement cette classe dans ce fichier

class NoteService {
    // Méthode qui récupère les data de localStorage
    readStorage(){
        // Déclarer une variable qui va contenir les data
        let arrNotas = [];
        // Récuperer les data du localStorage
        const serializedData = localStorage.getItem( STORAGE_NAME );

        // Traitement si la key n'existe pas
        if(!serializedData) return arrNotas;

        // Si la clé existe on va essayer de parser les datas
        try {
            // On tente de parser les datas
            arrNotas = JSON.parse( serializedData );

        } catch( error ) {
            // Si cela ne fonctionne pas (pour cause de données corrompues )
            // On supprime les données
            localStorage.removeItem( STORAGE_NAME );
        }

        // On retourne les datas
        return arrNotas;
    }

    // Méthode qui sauvegarde les data dans le localStorage
    saveStorage(arrNotas){
        // Transformer l'objet reçu en paramètre en chaîne de caractères
        const serializedData = JSON.stringify( arrNotas );

        // Une fois stringifier il faut l'enregistrer dans le localStorage
        try{
            // On essaye d'enregistrer dans le localStorage
            localStorage.setItem( STORAGE_NAME, serializedData );
        } catch (error){
            // Si on a une erreur on l'ffiche
            console.log(error);

            return false;
        }
    }
}

export default NoteService;