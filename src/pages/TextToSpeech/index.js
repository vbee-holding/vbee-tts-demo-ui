import React, { useState, useEffect } from "react";
import { FormGroup, Label, Row, Col, Input, Button, Alert, Spinner } from "reactstrap";
import * as apis from "../../api";
import "./styles.css";

const TextToSpeech = () => {
    const [techList, setTechList] = useState([]);
    const [voices, setVoices] = useState([]);
    const [selectedTech, setSelectedTech] = useState({});
    const [selectedVoices, setSelectedVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState({});
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");
    const [isDisplay, setIsDisplay] = useState(false);

    const fetchTeches = async () => {
        setIsLoading(true);
        const data = await apis.getSynthesisTeches();
        if (data.status) {
            setTechList(data.result);
            if (data.result && data.result[0]) setSelectedTech(data.result[0]);
        } else {
            setError(true);
        }
        setIsLoading(false);
    };

    const fetchVoices = async () => {
        setIsLoading(true);
        const data = await apis.getVoices();
        if (data.status) {
            setVoices(data.result);
        } else {
            setError(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTeches();
        fetchVoices();
    }, []);

    useEffect(() => {
        const validVoices = voices.filter((voice) => voice.synthesisTech === selectedTech.id);

        setSelectedVoices(validVoices);
        if (validVoices.length) {
            setSelectedVoice(validVoices[0]);
        } else {
            setSelectedVoice({});
        }
    }, [voices, selectedTech]);

    const handleChange = (e) => {
        const validVoices = selectedVoices.filter((voice) => voice.id === e.target.value);
        if (validVoices.length) {
            setSelectedVoice(validVoices[0]);
        } else {
            setSelectedVoice({});
        }
    };

    const handleReset = () => {
        setIsDisplay(false);
        setText("");
    };

    const handleCreateSynthesis = async () => {
        const data = await apis.createSynthesis(selectedVoice.key, text);
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
                Lỗi tải xuống dữ liệu
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
                        {techList.map((tech) => (
                            <Col key={tech.id}>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type='radio'
                                            name='tech'
                                            value={tech.id}
                                            onChange={() => setSelectedTech(tech)}
                                            checked={selectedTech.id === tech.id}
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
                    <Input type='select' name='voice' value={selectedVoice.id} onChange={handleChange}>
                        {selectedVoices.map((voice) => (
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
                    <Button color='primary' onClick={handleCreateSynthesis} disabled={text.length <= 0}>
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
