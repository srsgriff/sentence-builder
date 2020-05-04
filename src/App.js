import 'bootstrap/dist/css/bootstrap.min.css';
import { shuffle, isEmpty } from 'lodash';
import React from 'react';
import { Button, Col, Form, FormGroup, InputGroup, Nav, Navbar, Collapse, Row, Badge } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './App.css';
import WordPanel from './WordPanel';
import HelpModal from './HelpModal';

const NUMBER_OF_WORDS = 6;

class WordType {
    words = []
    currentWords = []
    length = 4
    workingLength = 4
    active = false
    default = true

    // Pass an object with new state or a function taking existing state and returning new state
    with(newState) {
        let newInstance = Object.assign(new WordType(), this)
        return Object.assign(newInstance, typeof newState === "function" ? newState(this) : newState)
    }
}

export default class App extends React.Component {

    state = {
        loading: false,
        showSettings: false,
        showHelp: false,

        verb: new WordType().with({active: true}),
        noun: new WordType().with({active: true}),
        adjective: new WordType(),
        adverb: new WordType().with({length: 5, workingLength: 5}),
        conjunction: new WordType().with({length: null, workingLength: null}),
    }

    componentDidMount() {
        this.fetchWords("./words/verb/default.txt", (words) => {
            this.setState({verb: this.state.verb.with({words: words})});
            if (this.state.noun.words) this.updateWords();
        })
        this.fetchWords("./words/noun/default.txt", (words) => {
            this.setState({noun: this.state.noun.with({words: words})});
            if (this.state.noun.words) this.updateWords();
        })
        // Adjectives and adverbs off by default so no need to update words after loading
        this.fetchWords("./words/adjective/default.txt", (words) => this.setState({adjective: this.state.adjective.with({words: words})}))
        this.fetchWords("./words/adverb/default.txt", (words) => this.setState({adverb: this.state.adverb.with({words: words})}))
        this.fetchWords("./words/conjunction/default.txt", (words) => this.setState({conjunction: this.state.conjunction.with({words: words})}))
    }

    fetchWords = (filename, callback) => {
        this.setState({loading: true})

        fetch(filename).then((response) => {
            if (response.status !== 200) {
                alert(`Unable to fetch word file: ${filename} Status Code: ${response.status}`);
                return;
            }

            response.text().then((data) => {
                callback(data.split("\n"));
                this.setState({loading: false});
            })
        })
    }

    updateWords = (isMixedLengths) => {
        this.setState({
            verb: this.state.verb.with((current) => ({
                currentWords: this.selectWords(current.words, isMixedLengths ? null : current.workingLength),
                length: current.workingLength
            })),
            noun: this.state.noun.with((current) => ({
                currentWords: this.selectWords(current.words, isMixedLengths ? null : current.workingLength),
                length: current.workingLength
            })),
            adjective: this.state.adjective.with((current) => ({
                currentWords: this.selectWords(current.words, isMixedLengths ? null : current.workingLength),
                length: current.workingLength
            })),
            adverb: this.state.adverb.with((current) => ({
                currentWords: this.selectWords(current.words, isMixedLengths ? null : current.workingLength),
                length: current.workingLength
            })),
            conjunction: this.state.conjunction.with((current) => ({currentWords: this.selectWords(current.words, null)})),
        })
    }

    selectWords = (words, wordLength) => shuffle(wordLength ? words.filter((w) => w.length === wordLength) : words)
        .slice(0, NUMBER_OF_WORDS)

    updateWordList = (wordTypeString, isDefault) => {

        if (this.state[wordTypeString].default !== isDefault) {
            this.fetchWords(
                `./words/${wordTypeString}/${isDefault ? "default" : wordTypeString}.txt`,
                (words) => {
                    this.setState({[wordTypeString]: this.state[wordTypeString].with({words: words, default: isDefault})})
                    this.updateWords(false)
                }
            )
        }
    }

    activateWordType = (wordTypeString) => {
        let newWordState = this.state[wordTypeString].with((current) => ({active: !current.active}))

        if (isEmpty(newWordState.currentWords)) {
            newWordState = newWordState.with((current) => (
                {
                    currentWords: this.selectWords(current.words, current.workingLength),
                    length: current.workingLength
                }
            ))
        }

        this.setState({[wordTypeString]: newWordState});
    }

    capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

    getActivateCheckbox = (wordTypeString) => (
        <Form.Check type="checkbox" inline>
            <Form.Check.Input
                type="checkbox"
                checked={this.state[wordTypeString].active}
                onChange={() => this.activateWordType(wordTypeString)}/>
            <Form.Check.Label>
                <Badge className={`${wordTypeString}-badge`}>{this.capitalize(wordTypeString)}s</Badge>
            </Form.Check.Label>
        </Form.Check>
    )

    getWordListControlBlock = (wordTypeString) => (<>
        <Col xs="4" style={{fontWeight: "bold"}}>
            {this.capitalize(wordTypeString)} list
        </Col>
        <Col xs="8" className="text-right">
            <Form.Check
                checked={this.state[wordTypeString].default}
                onChange={() => this.updateWordList(wordTypeString, true)}
                inline type="radio" label="default"/>
            <Form.Check
                checked={!this.state[wordTypeString].default}
                onChange={() => this.updateWordList(wordTypeString, false)}
                inline type="radio" label="full dictionary"/>
        </Col>
    </>)

    getWordLengthControl = (wordTypeString) => (
        <Col className="text-center">
            <FormGroup>
                <Form.Label className="control-label">
                    <Badge className={`${wordTypeString}-badge`}>{this.capitalize(wordTypeString)} Length</Badge>
                </Form.Label>
                <InputGroup className="word-length-input-group">
                    <InputGroup.Prepend onClick={() =>
                        this.setState({
                            [wordTypeString]: this.state[wordTypeString].with(
                                (current) => ({workingLength: current.workingLength - 1})
                            )
                        })
                    }>
                        <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="number"
                        size="lg"
                        value={this.state[wordTypeString].workingLength}
                        onChange={(e) => {
                            if (e.target.value)
                                this.setState({
                                    [wordTypeString]: this.state[wordTypeString].with(
                                        {workingLength: parseInt(e.target.value)}
                                    )
                                })
                        }}
                    />
                    <InputGroup.Append onClick={() =>
                        this.setState({
                            [wordTypeString]: this.state[wordTypeString].with(
                                (current) => ({workingLength: current.workingLength + 1})
                            )
                        })
                    }>
                        <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            </FormGroup>
        </Col>
    )

    render () {
        return (<>
            <Container className="px-0">
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>Sentence Builder</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Item>
                            <Nav.Link onClick={() => this.setState({showHelp: !this.state.showHelp})}>Help</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => this.setState({showSettings: !this.state.showSettings})}>
                                {this.state.showSettings ? "Hide" : "Show"} Settings
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Collapse in={this.state.showSettings}>
                    <div>
                        <Card>
                            <Card.Body>
                                <FormGroup>
                                    {this.getActivateCheckbox("verb")}
                                    {this.getActivateCheckbox("noun")}
                                    {this.getActivateCheckbox("adjective")}
                                    {this.getActivateCheckbox("adverb")}
                                    {this.getActivateCheckbox("conjunction")}
                                </FormGroup>
                                <Row>{this.getWordListControlBlock("verb")}</Row>
                                <Row>{this.getWordListControlBlock("noun")}</Row>
                                <Row>{this.getWordListControlBlock("adjective")}</Row>
                                <Row>{this.getWordListControlBlock("adverb")}</Row>
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>
                <Card className="margin-bottom-md">
                    <Card.Body>
                        <Form.Row>
                            {this.state.verb.active ? this.getWordLengthControl("verb") : null}
                            {this.state.noun.active ? this.getWordLengthControl("noun") : null}
                            {this.state.adjective.active ? this.getWordLengthControl("adjective") : null}
                            {this.state.adverb.active ? this.getWordLengthControl("adverb") : null}
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <FormGroup className="margin-bottom-0">
                                    <Button variant="primary" size="lg" onClick={() => this.updateWords(false)}>New words</Button>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="margin-bottom-0 text-right">
                                    <Button variant="primary" size="lg" onClick={() => this.updateWords(true)}>Random words</Button>
                                </FormGroup>
                            </Col>
                        </Form.Row>
                    </Card.Body>
                </Card>
                <WordPanel
                    loading={this.state.loading}
                    currentVerbs={this.state.verb.active ? this.state.verb.currentWords : null}
                    currentNouns={this.state.noun.active ? this.state.noun.currentWords : null}
                    currentAdjectives={this.state.adjective.active ? this.state.adjective.currentWords : null}
                    currentAdverbs={this.state.adverb.active ? this.state.adverb.currentWords : null}
                    currentConjunctions={this.state.conjunction.active ? this.state.conjunction.currentWords : null}/>
                <HelpModal
                    showHelp={this.state.showHelp}
                    onHide={() => this.setState({showHelp: false})}/>
            </Container>
        </>);
    }
}
