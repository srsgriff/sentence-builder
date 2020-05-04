import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class HelpModal extends React.Component {
    render() { return (
        <Modal show={this.props.showHelp} onHide={this.props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Sentence Builder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You can use this app to practice building English sentences.</p>
                <p>The app generates lists of words of different types:</p>
                <ul>
                    <li>Verbs</li>
                    <li>Nouns</li>
                    <li>Adjectives</li>
                    <li>Adverbs</li>
                    <li>Conjunctions</li>
                </ul>
                <p>
                    When you press <strong>"Go"</strong> at the bottom of the page, one word from each of the types will be highlighted,
                    and you can use the highlighted words to try and make a sentence.
                </p>
                <p>
                        When you want a new words, you can click <strong>"New words"</strong> and a new set will be generated. Also this will add new types
                        if you enabled these in the settings panel. <strong>"Random words"</strong> will give you new words of varying lengths.
                </p>
                <p>
                    You can choose make it harder or easier by changing the length of each of the types of words using the buttons.
                    To start with verbs and nouns are enabled, but you can add the other word types using the settings panel which
                    you can access by clicking <strong>"Show settings"</strong>.
                </p>
                <p>
                    By default a small set of common words it used for each type, but you can change each type to use the full
                    English dictionary again in the settings panel.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )}
}
