import 'bootstrap/dist/css/bootstrap.min.css';
import { sample } from 'lodash';
import React from 'react';
import { Badge, Button, Col, Row, Spinner } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import './App.css';
import { isEmpty } from 'lodash';

export default class WordPanel extends React.Component {

    state = {
        selectedVerb: null,
        selectedNoun: null,
        selectedAdjective: null,
        selectedAdverb: null,
        selectedConjunction: null
    }

    selectCurrentWords = () => this.setState({
        selectedVerb: this.props.currentVerbs ?
                sample(this.props.currentVerbs.filter((w) => w !== this.state.selectedVerb)) : null,
        selectedNoun: this.props.currentNouns ?
                sample(this.props.currentNouns.filter((w) => w !== this.state.selectedNoun)) : null,
        selectedAdjective: this.props.currentAdjectives ?
                sample(this.props.currentAdjectives.filter((w) => w !== this.state.selectedAdjective)) : null,
        selectedAdverb: this.props.currentAdverbs ?
                sample(this.props.currentAdverbs.filter((w) => w !== this.state.selectedAdverb)) : null,
        selectedConjunction: this.props.currentConjunctions ?
                sample(this.props.currentConjunctions.filter((w) => w !== this.state.selectedConjunction)) : null
    })



    renderWordSelection = (words, selectedWord, badgeClass) => words ? (
        <Col style={{paddingRight: 5}}>
            <h3 className="text-center">
                {
                    !isEmpty(words) ?
                        words.map((word, i) => (
                            <div style={{paddingRight: 5}} key={i}>
                                <Badge className={badgeClass + (word === selectedWord ? " badge-highlight" : "")}>{word}</Badge>
                            </div>
                        ))
                    :
                    (<Badge className={badgeClass}>No words</Badge>)
                }
            </h3>
        </Col>
    ) : null

    render() {
        return (
            <Card>
                <Card.Body>
                    {
                        this.props.loading ?
                            (<div className="text-center"><Spinner animation="border"/></div>)
                            :
                            (<>
                                <Row>
                                    {this.renderWordSelection(this.props.currentVerbs, this.state.selectedVerb, "verb-badge")}
                                    {this.renderWordSelection(this.props.currentNouns, this.state.selectedNoun, "noun-badge")}
                                    {this.renderWordSelection(this.props.currentAdjectives, this.state.selectedAdjective, "adjective-badge")}
                                    {this.renderWordSelection(this.props.currentAdverbs, this.state.selectedAdverb, "adverb-badge")}
                                    {this.renderWordSelection(this.props.currentConjunctions, this.state.selectedConjunction, "conjunction-badge")}
                                </Row>
                                <div className="text-center padding-bottom-xs">
                                    <Button size="lg" onClick={this.selectCurrentWords}>Go</Button>
                                </div>
                            </>)
                    }
                </Card.Body>
            </Card>
        );
    }
}
