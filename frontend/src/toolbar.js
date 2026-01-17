import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="topBar">
            <div className="brandRow">
                <div>
                    <div className="brandTitle">VectorShift Pipeline</div>
                    <div className="brandSubtitle">Drag nodes onto the canvas and connect them.</div>
                </div>
                <div className="brandSubtitle">Frontend Assessment</div>
            </div>

            <div className="toolbarGrid">
                <DraggableNode type="customInput" label="Input" />
                <DraggableNode type="llm" label="LLM" />
                <DraggableNode type="customOutput" label="Output" />
                <DraggableNode type="text" label="Text" />

                {/* your 5 new nodes */}
                <DraggableNode type="math" label="Math" />
                <DraggableNode type="merge" label="Merge" />
                <DraggableNode type="condition" label="Condition" />
                <DraggableNode type="delay" label="Delay" />
                <DraggableNode type="note" label="Note" />
            </div>
        </div>
    );
};
