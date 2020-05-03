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
        selectedVerb: sample(this.props.currentVerbs.filter((w) => w !== this.state.selectedVerb)),
        selectedNoun: sample(this.props.currentNouns.filter((w) => w !== this.state.selectedNoun)),
        selectedAdjective: sample(this.props.currentAdjectives.filter((w) => w !== this.state.selectedAdjective)),
        selectedAdverb: sample(this.props.currentAdverbs.filter((w) => w !== this.state.selectedAdverb)),
        selectedConjunction: sample(this.props.currentConjunctions.filter((w) => w !== this.state.selectedConjunction))
    })

    renderWordSelection = (words, selectedWord, badgeClass) => words.map((word, i) => (
        <div style={{paddingRight: 5}} key={i}>
            <Badge className={badgeClass + (word === selectedWord ? " badge-highlight" : "")}>{word}</Badge>
        </div>
    ))

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
                                    {
                                        !isEmpty(this.props.currentVerbs) ? (
                                            <Col style={{paddingRight: 5}}>
                                                <h3 className="text-center">
                                                    {this.renderWordSelection(this.props.currentVerbs, this.state.selectedVerb, "verb-badge")}
                                                </h3>
                                            </Col>
                                        ) : null
                                    }
                                    {
                                        !isEmpty(this.props.currentNouns) ? (
                                            <Col style={{paddingLeft: 5}}>
                                                <h3 className="text-center">
                                                    {this.renderWordSelection(this.props.currentNouns, this.state.selectedNoun, "noun-badge")}
                                                </h3>
                                            </Col>
                                        ) : null
                                    }
                                    {
                                        !isEmpty(this.props.currentAdjectives) ? (
                                            <Col style={{paddingLeft: 5}}>
                                                <h3 className="text-center">
                                                    {this.renderWordSelection(this.props.currentAdjectives, this.state.selectedAdjective, "adjective-badge")}
                                                </h3>
                                            </Col>
                                        ) : null
                                    }
                                    {
                                        !isEmpty(this.props.currentAdverbs) ? (
                                            <Col style={{paddingLeft: 5}}>
                                                <h3 className="text-center">
                                                    {this.renderWordSelection(this.props.currentAdverbs, this.state.selectedAdverb, "adverb-badge")}
                                                </h3>
                                            </Col>
                                        ) : null
                                    }
                                    {
                                        !isEmpty(this.props.currentConjunctions) ? (
                                            <Col style={{paddingLeft: 5}}>
                                                <h3 className="text-center">
                                                    {this.renderWordSelection(this.props.currentConjunctions, this.state.selectedConjunction, "conjunction-badge")}
                                                </h3>
                                            </Col>
                                        ) : null
                                    }
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
