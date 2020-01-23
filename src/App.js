import 'bootstrap/dist/css/bootstrap.min.css';
import { shuffle } from 'lodash';
import React from 'react';
import { Button, Col, Form, FormGroup, InputGroup, Nav, Navbar, Collapse, Row, Badge } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './App.css';
import WordPanel from './WordPanel';

const NUMBER_OF_WORDS = 6;

export default class App extends React.Component {

    state = {
        loading: false,
        showSettings: false,

        defaultVerbs: true,
        defaultNouns: true,

        verbsActive: true,
        nounsActive: true,
        adverbsActive: false,
        adjectivesActive: false,

        verbLength: 4,
        nounLength: 4,
        adverbLength: 4,
        adjectiveLength: 4,

        workingVerbLength: 4,
        workingNounLength: 4,
        workingAdverbLength: 4,
        workingAdjectiveLength: 4,

        verbs: [],
        nouns: [],
        adjectives: [],
        adverbs: [],

        currentVerbs: [],
        currentNouns: [],
        currentAdjectives: [],
        currentAdverbs: [],
    }

    componentDidMount() {
        this.fetchWords("./words/verb/default.txt", (words) => {
            this.setState({verbs: words})
            if (this.state.nouns) this.updateWords()
        })
        this.fetchWords("./words/noun/default.txt", (words) => {
            this.setState({nouns: words})
            if (this.state.verbs) this.updateWords()
        })
        // Adjectives and adverbs off by default so no need to update words after loading
        this.fetchWords("./words/adjective/adjective.txt", (words) => this.setState({adjectives: words}))
        this.fetchWords("./words/adverb/adverb.txt", (words) => this.setState({adverbs: words}))
    }

    fetchWords = (filename, callback) => {
        this.setState({loading: true})
        fetch(filename)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Unable to fetch ' + filename + '. Status Code: ' + response.status);
                    return;
                }

                response.text().then((data) => {
                    callback(data.split("\n"))
                    this.setState({loading: false})
                })
            })
    }

    updateWords = (isMixedLengths) => {
        this.setState({
            currentVerbs: this.selectWords(this.state.verbs, isMixedLengths ? null : this.state.workingVerbLength),
            currentNouns: this.selectWords(this.state.nouns, isMixedLengths ? null : this.state.workingNounLength),
            currentAdjectives: this.selectWords(this.state.adjectives, isMixedLengths ? null : this.state.workingAdjectiveLength),
            currentAdverbs: this.selectWords(this.state.adverbs, isMixedLengths ? null : this.state.workingAdverbLength),

            verbLength: this.state.workingVerbLength,
            nounLength: this.state.workingNounLength,
            adjectiveLength: this.state.workingAdjectiveLength,
            adverbLength: this.state.workingAdverbLength
        })
    }

    selectWords = (words, wordLength) => shuffle(wordLength ? words.filter((w) => w.length === wordLength) : words)
        .slice(0, NUMBER_OF_WORDS)

    updateVerbList = (defaultVerbs) => {
        if (this.state.defaultVerbs !== defaultVerbs) {
            this.setState({defaultVerbs: defaultVerbs})
            this.fetchWords(
                "./words/verb/" + (defaultVerbs ? "default" : "verb") + ".txt",
                (words) => {
                    this.setState({verbs: words})
                    this.updateWords(false)
                }
            )
        }
    }

    updateNounList = (defaultNouns) => {
        if (this.state.defaultNouns !== defaultNouns) {
            this.setState({defaultNouns: defaultNouns})
            this.fetchWords(
                "./words/noun/" + (defaultNouns ? "default" : "noun") + ".txt",
                (words) => {
                    this.setState({nouns: words})
                    this.updateWords(false)
                }
            )
        }
    }

    activateVerbs = () => {
        this.setState({verbsActive: !this.state.verbsActive})
        if (!this.state.currentVerbs) {
            this.setState({
                currentVerbs: this.selectWords(this.state.verbs, this.state.workingVerbLength),
                verbLength: this.workingVerbLength
            })
        }
    }

    activateNouns = () => {
        this.setState({nounsActive: !this.state.nounsActive})
        if (!this.state.currentNouns) {
            this.setState({
                currentNouns: this.selectWords(this.state.nouns, this.state.workingNounLength),
                nounLength: this.workingNounLength
            })
        }
    }

    activateAdjectives = () => {
        this.setState({adjectivesActive: !this.state.adjectivesActive})
        if (!this.state.currentAdjectives) {
            this.setState({
                currentAdjectives: this.selectWords(this.state.adjectives, this.state.workingAdjectiveLength),
                adjectiveLength: this.workingAdjectiveLength
            })
        }
    }

    activateAdverbs = () => {
        this.setState({adverbsActive: !this.state.adverbsActive})
        if (!this.state.currentAdverbs) {
            this.setState({
                currentAdverbs: this.selectWords(this.state.adverbs, this.state.workingAdverbLength),
                adverbLength: this.workingAdverbLength
            })
        }
    }

    render () {
        return (<>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Sentence Builder</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Item>
                        <Nav.Link onClick={() => this.setState({showSettings: !this.state.showSettings})}>
                            {this.state.showSettings ? "Hide" : "Show"} settings
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
            <Container fluid='true'>
                <Collapse in={this.state.showSettings}>
                    <div>
                        <Card>
                            <Card.Body>
                                <FormGroup>
                                    <Form.Check
                                        checked={this.state.verbsActive}
                                        // should be event.target.value?
                                        onChange={this.activateVerbs}
                                        inline type="checkbox" label="verbs"/>
                                    <Form.Check
                                        checked={this.state.nounsActive}
                                        onChange={() => this.setState({nounsActive: !this.state.nounsActive})}
                                        inline type="checkbox" label="nouns"/>
                                    <Form.Check
                                        checked={this.state.adjectivesActive}
                                        onChange={() => this.setState({adjectivesActive: !this.state.adjectivesActive})}
                                        inline type="checkbox" label="adjectives"/>
                                    <Form.Check inline
                                        checked={this.state.adverbsActive}
                                        onChange={() => this.setState({adverbsActive: !this.state.adverbsActive})}
                                        inline type="checkbox" label="adverbs"/>
                                </FormGroup>
                                <Row>
                                    <Col style={{fontWeight: "bold"}}>Verb list</Col>
                                    <Form.Check
                                        checked={this.state.defaultVerbs}
                                        onChange={() => this.updateVerbList(true)}
                                        inline type="radio" label="default"/>
                                    <Form.Check
                                        checked={!this.state.defaultVerbs}
                                        onChange={() => this.updateVerbList(false)}
                                        inline type="radio" label="full dictionary"/>
                                </Row>
                                <Row>
                                    <Col style={{fontWeight: "bold"}}>Noun list</Col>
                                    <Form.Check
                                        checked={this.state.defaultNouns}
                                        onChange={() => this.updateNounList(true)}
                                        inline type="radio" label="default"/>
                                    <Form.Check
                                        checked={!this.state.defaultNouns}
                                        onChange={() => this.updateNounList(false)}
                                        inline type="radio" label="full dictionary"/>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>
                <Card className="margin-bottom-md">
                    <Card.Body>
                        <Form.Row>
                            {
                                this.state.verbsActive ? (
                                    <Col className="text-center">
                                        <FormGroup>
                                            <Form.Label className="control-label">
                                                <Badge className="verb-badge">Verb Length</Badge>
                                            </Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend onClick={() => this.setState({workingVerbLength: this.state.workingVerbLength - 1})}>
                                                    <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control
                                                    type="number"
                                                    size="lg"
                                                    value={this.state.workingVerbLength}
                                                    onChange={(e) => e.target.value ? this.setState({workingVerbLength: parseInt(e.target.value)}) : null}/>
                                                <InputGroup.Append onClick={() => this.setState({workingVerbLength: this.state.workingVerbLength + 1})}>
                                                    <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                ) : null
                            }
                            {
                                this.state.nounsActive ? (
                                    <Col className="text-center">
                                        <FormGroup>
                                            <Form.Label className="control-label">
                                                <Badge className="noun-badge">Noun Length</Badge>
                                            </Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend onClick={() => this.setState({workingNounLength: this.state.workingNounLength - 1})}>
                                                    <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control
                                                    type="number"
                                                    size="lg"
                                                    value={this.state.workingNounLength}
                                                    onChange={(e) => e.target.value ? this.setState({workingNounLength: parseInt(e.target.value)}) : null}/>
                                                <InputGroup.Append onClick={() => this.setState({workingNounLength: this.state.workingNounLength + 1})}>
                                                    <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                ) : null
                            }
                            {
                                this.state.adjectivesActive ? (
                                    <Col className="text-center">
                                        <FormGroup>
                                            <Form.Label className="control-label">
                                                <Badge className="adjective-badge">Adjective Length</Badge>
                                            </Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend onClick={() => this.setState({workingAdjectiveLength: this.state.workingAdjectiveLength - 1})}>
                                                    <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control
                                                    type="number"
                                                    size="lg"
                                                    value={this.state.workingAdjectiveLength}
                                                    onChange={(e) => e.target.value ? this.setState({workingAdjectiveLength: parseInt(e.target.value)}) : null}/>
                                                <InputGroup.Append onClick={() => this.setState({workingAdjectiveLength: this.state.workingAdjectiveLength + 1})}>
                                                    <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                ) : null
                            }
                            {
                                this.state.adverbsActive ? (
                                    <Col className="text-center">
                                        <FormGroup>
                                            <Form.Label className="control-label">
                                                <Badge className="adverb-badge">Adverb Length</Badge>
                                            </Form.Label>
                                            <InputGroup>
                                                <InputGroup.Prepend onClick={() => this.setState({workingAdverbLength: this.state.workingAdverbLength - 1})}>
                                                    <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control
                                                    type="number"
                                                    size="lg"
                                                    value={this.state.workingAdverbLength}
                                                    onChange={(e) => e.target.value ? this.setState({workingAdverbLength: parseInt(e.target.value)}) : null}/>
                                                <InputGroup.Append onClick={() => this.setState({workingAdverbLength: this.state.workingAdverbLength + 1})}>
                                                    <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                ) : null
                            }
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
                    currentVerbs={this.state.verbsActive ? this.state.currentVerbs : []}
                    currentNouns={this.state.nounsActive ? this.state.currentNouns : []}
                    currentAdjectives={this.state.adjectivesActive ? this.state.currentAdjectives : []}
                    currentAdverbs={this.state.adverbsActive ? this.state.currentAdverbs : []}/>
            </Container>
        </>);
    }
}
