import '../assets/style.css';
import NoteService from './Services/NoteService'
import Note from './Note';

class App {

    // ÉLEMENT DU DOM
    elInputNewNoteTitle;
    elInputNewNoteContent;
    elOlNoteList;

    // PROPRIÉTÉ DE FONCTIONNEMENT
    // service de données
    noteService;

    // tableau de note
    arrNotas = [];

    // indication de l'activation du mode édit
    isEditMode = false;


    start() {
        console.log('App démarrée...');

        // on instancie le service de données
        this.noteService = new NoteService();

        // chargement de l'interface utilisateur
        this.loadDom();

        // on récupère les anciennes données dans le localStorage
        const arrNoteLitterals = this.noteService.readStorage();

        // si le storage est vide on ne fait rien
        if (!arrNoteLitterals) return; // if(arrNoteLitterals.lenght <= 0) return;

        // si on a des éléments dans le tableau, on remplit notre propriété arrNotas
        for (let noteLitteral of arrNoteLitterals) {
            console.log('noteLitteral', noteLitteral)
            this.arrNotas.push(new Note(noteLitteral));
        }
        console.log('this.arrNotas', this.arrNotas);

        // on lance le rendu des notes
        this.renderNotes();
    }

    // méthode pour créer l'interface graphique
    loadDom() {
        /*         <header>
                <h1>NotaBene</h1>
        
                <form novalidate>
                    <input type="text" id="new-nota-title" placeholder="Titre">
                    <textarea id="new-nota-content" placeholder="Contenu"></textarea>
                    <button type="button" id="new-nota-add">➕</button>
                </form>
        
                <div>
                    <button type="button" id="clear-all">🗑️</button>
                </div>
            </header> */

        // HEADER
        const elHeader = document.createElement('header');
        elHeader.innerHTML = '<h1>NotaBene</h1>';

        // FORM NOVALIDATE
        const elForm = document.createElement('form');
        elForm.noValidate = true;

        this.elInputNewNoteTitle = document.createElement('input'); // <input type="text" id="new-nota-title" placeholder="Titre"> 
        // OU this.elInputNewNoteTitle.setAttribute('type', 'text')

        this.elInputNewNoteTitle.type = 'text';


        this.elInputNewNoteTitle.id = 'new-nota-title';
        this.elInputNewNoteTitle.placeholder = 'Titre';

        this.elInputNewNoteContent = document.createElement('textarea');// <textarea id="new-nota-content" placeholder="Contenu"></textarea>
        this.elInputNewNoteContent.placeholder = 'Contenu';

        const elButtonNewNoteAdd = document.createElement('button');
        elButtonNewNoteAdd.type = 'button';
        elButtonNewNoteAdd.id = 'new-nota-add';
        elButtonNewNoteAdd.textContent = '➕';
        // ajouter un eventListener sur le bouton
        elButtonNewNoteAdd.addEventListener('click', this.handleNewNoteAdd.bind(this));

        // input + textarea + button doivent être mis dans le form
        elForm.append(this.elInputNewNoteTitle, this.elInputNewNoteContent, elButtonNewNoteAdd);

        // div avec bouton pour supprimer les notes
        const elDivClear = document.createElement('div');
        const elButtonClearAll = document.createElement('button');
        elButtonClearAll.type = 'button';
        elButtonClearAll.id = 'clear-all';
        elButtonClearAll.textContent = '🗑️';
        // ajouter un eventListener sur le bouton
        elButtonClearAll.addEventListener('click', this.handleClearAll.bind(this));

        // bouton dans le div
        elDivClear.append(elButtonClearAll);

        // form + div dans le header
        elHeader.append(elForm, elDivClear);

        const elMain = document.createElement('main');

        // <ol id="nota-list"></ol>
        this.elOlNoteList = document.createElement('ol');
        this.elOlNoteList.id = 'nota-list';

        // ol dans le main
        elMain.append(this.elOlNoteList);

        // header + main dans le body
        document.body.append(elHeader, elMain);
    }

    // Méthodes pour supprimer toute les notes
    handleClearAll() {
        // vider le tableau arrNotas
        this.arrNotas = [];
        // vider le localStorage
        this.noteService.saveStorage(this.arrNotas);
        // on vide la liste d'affichage
        this.elOlNoteList.innerHTML = '';
    }

    // méthode pour ajouter une note
    handleNewNoteAdd() {
        // on crée nos constantes pour récupérer les valeurs des inputs
        let newTitle = this.elInputNewNoteTitle.value;
        let newContent = this.elInputNewNoteContent.value;
        let now = Date.now();

        // on check si les hamps sont vides
        if (newTitle == '' && newContent == '') {
            /* this.elInputNewNoteTitle.value = 'Note sans titre';
            this.elInputNewNoteContent.value = 'Note sans contenu'; */
            alert('Veuillez remplir au moins un champ');
        } else {
            console.log('titre', newTitle);
            console.log('contenu', newContent);
            // on crée une nouvelle note
            // on doit reconstruire un objet littéral
            const newNoteLitteral = {
                title: newTitle == "" ? "Note sans titre" : newTitle,
                content: newContent == "" ? "Note sans contenu" : newContent,
                dateCreate: now,
                dateUpdate: now
            }

            console.log(newNoteLitteral);

            // on rajoute l'objet littéral dans le tableau de notes
            this.arrNotas.push(new Note(newNoteLitteral));
            // sauvegarde dans le localStorage
            this.noteService.saveStorage(this.arrNotas);
            // on vide le formulaire
            this.elInputNewNoteTitle.value = this.elInputNewNoteContent.value = '';
            // on met un focus sur le premier champ
            this.elInputNewNoteTitle.focus();
            // on régénère les notes
            this.renderNotes();
        }

        // if (newTitle == '' && newContent == '') {
        //     /* this.elInputNewNoteTitle.value = 'Note sans titre';
        //     this.elInputNewNoteContent.value = 'Note sans contenu'; */
        //     alert('Veuillez remplir au moins un champ');
        // } else if (newTitle == '') {
        //     this.elInputNewNoteTitle.value = 'Note sans titre';
        // } else if (newContent == '') {
        //     this.elInputNewNoteContent.value = 'Note sans contenu';
        // } else {
        //     console.log('titre', newTitle);
        //     console.log('contenu', newContent);
        //     // on crée une nouvelle note
        //     // on doit reconstruire un objet littéral
        //     const newNoteLitteral = {
        //         title: newTitle,
        //         content: newContent,
        //         dateCreate: now,
        //         dateUpdate: now
        //     }

        //     console.log(newNoteLitteral);

        //     // on rajoute l'objet littéral dans le tableau de notes
        //     this.arrNotas.push(new Note(newNoteLitteral));
        //     // sauvegarde dans le localStorage
        //     this.noteService.saveStorage(this.arrNotas);
        //     // on vide le formulaire
        //     this.elInputNewNoteTitle.value = this.elInputNewNoteContent.value = '';
        //     // on met un focus sur le premier champ
        //     this.elInputNewNoteTitle.focus();
        //     // on régénère les notes
        //     this.renderNotes();
        // }
    }

    // méthode pour afficher les notes
    renderNotes() {
        // on vide le ol
        this.elOlNoteList.innerHTML = '';

        // on retrie par date de mise à jour
        this.arrNotas.sort((a, b) => {
            return b.dateUpdate - a.dateUpdate;
        });

        // on boucle sur le tableau de notes
        for (let note of this.arrNotas) {
            this.elOlNoteList.append(
                note.getDom() // on récupère l'élément HTML de la note
            );
        }
    }
}



const app = new App();

export default app;