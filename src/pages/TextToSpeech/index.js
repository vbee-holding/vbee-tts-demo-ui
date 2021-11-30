import React, { useState, useEffect } from "react";
import { FormGroup, Label, Row, Col, Input, Button, Alert, Spinner } from "reactstrap";
import * as apis from "../../api";
import "./styles.css";

const TextToSpeech = () => {
    const [listTech, setListTech] = useState([]);
    const [listVoice, setListVoice] = useState([]);
    const [isSelectedTech, setIsSelectedTech] = useState({});
    const [selectedListVoice, setSelectedListVoice] = useState([]);
    const [isSelectedVoice, setIsSelectedVoice] = useState({});
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");
    const [isDisplay, setIsDisplay] = useState(false);

    useEffect(() => {
        const fetchTeches = async () => {
            setIsLoading(true);
            const data = await apis.getSynthesisTeches();
            if (data.status) {
                setListTech(data.result);
                if (data.result && data.result[0]) setIsSelectedTech(data.result[0]);
            } else {
                setError(true);
            }
            setIsLoading(false);
        };

        const fetchVoices = async () => {
            setIsLoading(true);
            const data = await apis.getVoices();
            if (data.status) {
                setListVoice(data.result);
            } else {
                setError(true);
            }
            setIsLoading(false);
        };
        fetchTeches();
        fetchVoices();
    }, []);

    useEffect(() => {
        const list = listVoice.filter((voice) => voice.synthesisTech === isSelectedTech.id);

        setSelectedListVoice(list);
        if (list[0]) {
            setIsSelectedVoice(list[0]);
        } else {
            setIsSelectedVoice({});
        }
    }, [listVoice, isSelectedTech]);

    const handleChange = (e) => {
        const currentVoice = selectedListVoice.filter((voice) => voice.id === e.target.value)[0];
        setIsSelectedVoice(currentVoice);
    };

    const handleReset = () => {
        setIsDisplay(false);
        setText("");
    };

    const handleRead = async () => {
        const data = await apis.convertText({ voice: isSelectedVoice.key, input_text: text });
        if (data.status) {
            setIsDisplay(true);
            let audioElement = document.getElementById("audioElement");
            audioElement.src = data.result;
        } else {
            setError(true);
        }
    };

    if (error) {
        return (
            <Alert className='mt-5 me-5 ms-5' color='danger'>
                Something went wrong ...
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <div className=' w-100 text-center mt-5'>
                <Spinner color='primary' className='spinner' />
            </div>
        );
    }
    return (
        <div className='background'>
            <div className='box'>
                <h1 className='h4 text-center mb-4'>Chuyển đổi văn bản sang giọng nói tiếng Việt</h1>
                <FormGroup className='mb-3'>
                    <Label className='mb-2 h6'>Công nghệ TTS</Label>
                    <Row>
                        {listTech.map((tech) => (
                            <Col key={tech.id}>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type='radio'
                                            name='tech'
                                            value={tech.id}
                                            onChange={() => setIsSelectedTech(tech)}
                                            checked={isSelectedTech.id === tech.id}
                                        />
                                        {tech.id}
                                    </Label>
                                </FormGroup>
                            </Col>
                        ))}
                    </Row>
                </FormGroup>
                <FormGroup className='mb-3'>
                    <Label className='h6 mb-2'>Giọng đọc</Label>
                    <Input type='select' name='voice' value={isSelectedVoice.id} onChange={handleChange}>
                        {selectedListVoice.map((voice) => (
                            <option key={voice.id} value={voice.id}>
                                {voice.name}
                            </option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup className='mb-4'>
                    <Label className='mb-2 d-flex justify-content-between align-items-center'>
                        <span className='h6'>Văn bản</span>

                        <Button outline color='danger' size='sm' onClick={handleReset}>
                            <i className='fas fa-trash'></i>
                        </Button>
                    </Label>
                    <Input
                        id='text'
                        type='textarea'
                        name='text'
                        rows='5'
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                    />
                </FormGroup>
                <FormGroup className='mb-4 text-center'>
                    <Button color='primary' onClick={handleRead} disabled={text.length <= 0}>
                        Đọc ngay
                    </Button>
                </FormGroup>
                {isDisplay && (
                    <FormGroup className='text-center'>
                        <audio controls autoPlay id='audioElement' src=''>
                            Trình duyệt của bạn không hỗ trợ phát âm thanh!
                        </audio>
                    </FormGroup>
                )}
            </div>
        </div>
    );
};

export default TextToSpeech;
