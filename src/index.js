import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker } from '@wordpress/components';
import './index.scss';

import { InspectorControls, BlockControls, AlignmentToolbar, useBlockProps } from '@wordpress/block-editor';

(function () {
  // subscribe to any changes in the blocks
  try {
    let locked = false;
    wp.data.subscribe(() => {
      const results = wp.data
        .select('core/block-editor')
        .getBlocks()
        .filter((block) => block.name === 'my-plugin/pay-attention' && block.attributes.correctAnswer == undefined);
      if (results.length > 0 && !locked) {
        locked = true;
        wp.data.dispatch('core/editor').lockPostSaving('no-correct-answer');
      }
      if (!results.length > 0 && locked) {
        locked = false;
        wp.data.dispatch('core/editor').unlockPostSaving('no-correct-answer');
      }
    });
  } catch (err) {
    console.log(err);
  }
})();

wp.blocks.registerBlockType('my-plugin/pay-attention', {
  title: 'Are you paying attention?',
  icon: 'smiley',
  category: 'common',
  attributes: {
    question: { type: 'string' },
    answers: { type: 'array', default: [''] },
    correctAnswer: { tyoe: 'number', default: undefined },
    bgColor: { type: 'string', default: '#ebebeb' },
    theAlignment: { type: 'string', default: 'left' },
  },
  example: {
    attributes: {
      question: 'What is my name?',
      correctAnswer: 3,
      answers: ['dog', 'barks', 'mew'],
      theAlignment: 'center',
      bgColor: '#cfe8f1',
    },
  },
  edit: EditComponent,
  save: function (props) {
    return null;
  },
});
function EditComponent(props) {
  function updateQuestion(value) {
    props.setAttributes({ question: value });
  }

  function deleteAnswer(indexToDelete) {
    const newAnswers = props.attributes.answers.filter((answer, index) => index !== indexToDelete);
    props.setAttributes({ answers: newAnswers });

    if (props.attributes.correctAnswer === indexToDelete) {
      props.setAttributes({ correctAnswer: undefined });
    }
  }

  function markAsCorrect(correctIndex) {
    props.setAttributes({ correctAnswer: correctIndex });
  }

  const blockProps = useBlockProps({
    className: 'pay-attention-edit-block',
    style: {
      backgroundColor: props.attributes.bgColor,
    },
  });

  return (
    <div {...blockProps}>
      <BlockControls>
        <AlignmentToolbar
          value={props.attributes.theAlignment}
          onChange={(x) =>
            props.setAttributes({
              theAlignment: x,
            })
          }
        ></AlignmentToolbar>
      </BlockControls>
      <InspectorControls>
        <PanelBody title="Background Color" initialOpen={true}>
          <PanelRow>
            <ColorPicker
              disableAlpha={true}
              color={props.attributes.bgColor}
              onChangeComplete={(x) =>
                props.setAttributes({
                  bgColor: x.hex,
                })
              }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <TextControl
        label="Question:"
        style={{
          fontSize: '20px',
        }}
        value={props.attributes.question}
        onChange={updateQuestion}
      />
      <p
        style={{
          fontSize: '13px',
          margin: '20px 0 8px 0',
        }}
      >
        Answers:
      </p>
      {props.attributes.answers?.map((answer, index) => {
        return (
          <Flex>
            <FlexBlock>
              <TextControl
                value={answer}
                onChange={(newValue) => {
                  const newAnswers = props.attributes.answers.concat([]);
                  newAnswers[index] = newValue;
                  props.setAttributes({ answers: newAnswers });
                }}
              />
            </FlexBlock>
            <FlexItem>
              <Button onClick={() => markAsCorrect(index)}>
                <Icon icon={props.attributes.correctAnswer === index ? 'star-filled' : 'star-empty'} className="mark-as-correct" />
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                isLink
                className="attention-delete"
                onClick={() => {
                  deleteAnswer(index);
                }}
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        );
      })}
      <Button
        isPrimary
        onClick={() => {
          const newAnswers = props.attributes.answers.concat(['']);
          props.setAttributes({ answers: newAnswers });
        }}
      >
        Add Another Answer
      </Button>
    </div>
  );
}
