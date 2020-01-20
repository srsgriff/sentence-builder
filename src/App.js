import 'bootstrap/dist/css/bootstrap.min.css';
import { sample, shuffle } from 'lodash';
import React from 'react';
import { Badge, Button, Col, Form, FormGroup, InputGroup, Navbar, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './App.css';
import nounsJson from './nouns.json';
import verbsJson from './verbs.json';

const NUMBER_OF_WORDS = 6;

export default class App extends React.Component {

  state = {
    verbs: verbsJson.verbs,
    nouns: nounsJson.nouns,
    currentNouns: [],
    currentVerbs: [],
    selectedNoun: null,
    selectedVerb: null,
    verbLength: 4,
    nounLength: 4
  }

  componentDidMount() { this.updateWords() }

  updateWords = (isMixedLengths) => this.setState({
      currentVerbs: this.selectWords(this.state.verbs, isMixedLengths ? null : this.state.verbLength),
      currentNouns: this.selectWords(this.state.nouns, isMixedLengths ? null : this.state.nounLength),
      selectedVerb: null,
      selectedNoun: null
  })

  selectCurrentWords = () => this.setState({
    selectedVerb: sample(this.state.currentVerbs.filter((w) => w !== this.state.selectedVerb)),
    selectedNoun: sample(this.state.currentNouns.filter((w) => w !== this.state.selectedNoun))
  })

  selectWords = (words, wordLength) => shuffle(wordLength ? words.filter((w) => w.length === wordLength) : words)
      .slice(0, NUMBER_OF_WORDS)

  renderWordSelection = (words, selectedWord, badgeClass) => words.map((word, i) => (
      <div style={{paddingRight: 5}} key={i}>
        <Badge className={badgeClass + (word === selectedWord ? " badge-highlight" : "")}>{word}</Badge>
      </div>
    ))

  render () {
    return (<>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Sentence Builder</Navbar.Brand>
      </Navbar>
      <Container fluid='true'>
        <Card style={{marginBottom: 15}}>
          <Card.Body>
            <Form.Row>
              <Col className="text-center">
                <FormGroup>
                  <Form.Label style={{fontSize: 22}}>Verb Length</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend onClick={() => this.setState({verbLength: this.state.verbLength - 1})}>
                      <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="number"
                        size="lg"
                        value={this.state.verbLength}
                        onChange={(e) => e.target.value ? this.setState({verbLength: parseInt(e.target.value)}) : null}/>
                    <InputGroup.Append onClick={() => this.setState({verbLength: this.state.verbLength + 1})}>
                      <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col className="text-center">
                <FormGroup>
                  <Form.Label style={{fontSize: 22}}>Noun Length</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend onClick={() => this.setState({nounLength: this.state.nounLength - 1})}>
                      <InputGroup.Text className="numeric-input-button">-</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="number"
                        size="lg"
                        value={this.state.nounLength}
                        onChange={(e) => e.target.value ? this.setState({nounLength: parseInt(e.target.value)}) : null}/>
                    <InputGroup.Append onClick={() => this.setState({nounLength: this.state.nounLength + 1})}>
                      <InputGroup.Text className="numeric-input-button">+</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <FormGroup style={{marginBottom: 0}}>
                  <Button variant="primary" size="lg" onClick={() => this.updateWords(false)}>New words</Button>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup style={{marginBottom: 0}} className="text-right">
                  <Button variant="primary" size="lg" onClick={() => this.updateWords(true)}>Random words</Button>
                </FormGroup>
              </Col>
            </Form.Row>
          </Card.Body>
        </Card>
        <Card style={{marginBottom: 15}}>
          <Card.Body>
            <Row>
              <Col style={{paddingRight: 5}}>
                <h3 className="text-center">
                  {this.renderWordSelection(this.state.currentVerbs, this.state.selectedVerb, "verb-badge")}
                </h3>
              </Col>
              <Col style={{paddingLeft: 5}}>
                <h3 className="text-center">
                  {this.renderWordSelection(this.state.currentNouns, this.state.selectedNoun, "noun-badge")}
                </h3>
              </Col>
            </Row>
            <div className="text-center" style={{paddingBottom: 5}}>
              <Button size="lg" onClick={this.selectCurrentWords}>Go</Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>);
  }
}
