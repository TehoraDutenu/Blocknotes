import app from './App'

const MODE_VIEW = 'view';
const MODE_EDIT = 'edit';

class Note {
    // on déclare ses propriétés
    title;
    content;
    dateCreate;
    dateUpdate;

    // modèle d'objet littéral pour une Note
    // noteLitteral {
    // 
    //      title: 'acheter du pain",
    //      content: 'pain aux céréales',
    //      dateCreate: '16210124568',
    //      dateUpdate: '16210124568'
    // }

    // déclarer le constructeur qui récupère un objet littéral
    // et qui va hydrater notre instance de Note
    constructor(noteLitteral) {
        this.title = noteLitteral.title;
        this.content = noteLitteral.content;
        this.dateCreate = noteLitteral.dateCreate;
        this.dateUpdate = noteLitteral.dateUpdate;
    }

    // méthode qui construit et retourne l'élément DOM de la note
    getDom() {
        /*         const li = document.createElement( 'li' );
                li.classList.add( 'nota' );
                li.dataset.mode = MODE_VIEW;
        
                let 
                    dateCreate = new Date(nota.dateCreate),
                    dateUpdate = new Date(nota.dateUpdate);
        
                // header
                let innerDom = '<div class="nota-header">';
                innerDom += '<div class="nota-times">';
                innerDom +=     `<strong>création: </strong>${dateCreate.toLocaleString()}<br>`;
                innerDom +=     `<strong>màj: </strong>${dateUpdate.toLocaleString()}`;
                innerDom += '</div><div class="nota-cmd">';
                innerDom += '<div data-cmd="view">';
                innerDom +=     '<button type="button" data-role="edit">✏️</button>';
                innerDom +=     '<button type="button" data-role="delete">🗑️</button>';
                innerDom += '</div>';
                innerDom += '<div data-cmd="edit">';
                innerDom +=     '<button type="button" data-role="save">💾</button>';
                innerDom +=     '<button type="button" data-role="cancel">❌</button>';
                innerDom += '</div>';
                innerDom += '</div></div>';
        
        
                // title
                innerDom += `<div class="nota-title">${nota.title}</div>`;
        
                // content
                innerDom += `<div class="nota-content">${nota.content}</div>`;
        
                li.innerHTML = innerDom;
        
                li.addEventListener( 'click', handlerCmdNota ); */

        const elLi = document.createElement('li');
        elLi.classList.add('nota');
        elLi.dataset.mode = MODE_VIEW;

        // on transforme le timestamp en vraie date lisisble
        let dateCreate = new Date(this.dateCreate);
        let dateUpdate = new Date(this.dateUpdate);

        // header
        let innerDom = '<div class="nota-header">';
        innerDom += '<div class="nota-times">';
        innerDom += `<strong>création: </strong>${dateCreate.toLocaleString()}<br>`;
        innerDom += `<strong>màj: </strong>${dateUpdate.toLocaleString()}`;
        innerDom += '</div><div class="nota-cmd">';
        innerDom += '<div data-cmd="view">';
        innerDom += '<button type="button" data-role="edit">✏️</button>';
        innerDom += '<button type="button" data-role="delete">🗑️</button>';
        innerDom += '</div>';
        innerDom += '<div data-cmd="edit">';
        innerDom += '<button type="button" data-role="save">💾</button>';
        innerDom += '<button type="button" data-role="cancel">❌</button>';
        innerDom += '</div>';
        innerDom += '</div></div>';

        // title
        innerDom += `<div class="nota-title">${this.title}</div>`;

        // content
        innerDom += `<div class="nota-content">${this.content}</div>`;

        elLi.innerHTML = innerDom;

        elLi.addEventListener('click', this.handleClick.bind(this));

        return elLi;
    }

    // GESTIONNAIRE D'ÉVÉNEMENTS
    // méthode pour la gestion des actions des différents boutons
    handleClick(evt) {
        /*    const 
                domLi = evt.currentTarget,
                domBtn = evt.target,
                domTitle = domLi.querySelector( '.nota-title' ),
                domContent = domLi.querySelector( '.nota-content' ),
                idxLi = Array.from(domNotaList.children).indexOf( domLi ),
                dataNota = arrNotas[idxLi];
         */

        const elLi = evt.currentTarget; // currentTarget est l'élément sur lequel on a posé l'écouteur
        const elBTN = evt.target; // target est l'élément sur lequel on a cliqué
        const elTitle = elLi.querySelector('.nota-title'); // on récupère l'élément qui a la classe nota-title
        const elContent = elLi.querySelector('.nota-content'); // on récupère l'élément qui a la classe nota-content
        const idxLi = Array.from(elLi.parentElement.children).indexOf(elLi); // on récupère l'index de l'élément li dans la liste des li
        const objNote = app.arrNotas[idxLi]; // récupération de arrayNotes[idxLi] depuis app

        // si le <li> n'est pas cohérent avec les datas, on return
        if (!app.isEditMode && elTitle.textContent !== objNote.title) return;

        //gérer les différents événements des boutons
        switch (elBTN.dataset.role) {
            case 'edit':
                console.log('edit');
                // si non n'est pas censé avoir accès à édit, on return
                if (app.isEditMode) return;
                // on passe en mode edit
                app.isEditMode = true;
                // on passe le dataset.mode en edit
                elLi.dataset.mode = MODE_EDIT;
                // on passe le contenu de l'élément en input
                elTitle.contentEditable = elContent.contentEditable = true;
                break;
            case 'delete':
                // si on n'est pas censé avoir accès à delete, on return
                if (app.isEditMode) return;
                // on supprime la note
                app.arrNotas.splice(idxLi, 1);
                // on sauvegarde les données
                app.noteService.saveStorage();
                // on regénère un rendu des notes
                app.renderNotes();
                break;
            case 'save':
                console.log('tutu');
                // si non n'est pas censé avoir accès à save, on return
                if (!app.isEditMode) return;
                // mise à jour des données du tableau
                objNote.title = elTitle.textContent;
                objNote.content = elContent.textContent;
                objNote.dateUpdate = Date.now();

                // on enregistre dans le local storage
                app.noteService.saveStorage(app.arrNotas);
                // on passe en mode view
                app.isEditMode = false;
                // on régénère un rendu de notre
                app.renderNotes();
                break;
            case 'cancel':
                // si on n'est pas censé avoir accès à cancel, on return
                if (!app.isEditMode) return;
                // on passe en mode view
                app.isEditMode = false;
                // on passe le dataset.mode en view
                elLi.dataset.mode = MODE_VIEW;
                // on régénère un rendu de note
                app.renderNotes();
                break;
            default:
                return;
        }
    }
}

export default Note;