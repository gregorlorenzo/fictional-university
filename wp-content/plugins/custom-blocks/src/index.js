import "./index.scss"
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker } from "@wordpress/components"
import { InspectorControls, BlockControls, AlignmentToolbar, useBlockProps } from "@wordpress/block-editor"

(function () {
  setTimeout(function () {
    let locked = false

    wp.data.subscribe(function () {
      const results = wp.data.select("core/block-editor").getBlocks().filter(function (block) {
        return block.name == "ourplugin/custom-blocks" && block.attributes.correctAnswer == undefined
      })

      if (results.length && locked == false) {
        locked = true
        wp.data.dispatch("core/editor").lockPostSaving("noanswer")
      }

      if (!results.length && locked) {
        locked = false
        wp.data.dispatch("core/editor").unlockPostSaving("noanswer")
      }
    })
  }, 200)
})()

wp.blocks.registerBlockType("ourplugin/custom-blocks", {
  title: "Custom Blocks",
  description: "Give your audience a chance to expand their knowledge.",
  icon: "smiley",
  category: "common",
  attributes: {
    question: { type: "string" },
    answers: { type: "array", default: [""] },
    correctAnswer: { type: "number", default: undefined },
    bgColor: { type: "string", default: "#EBEBEB" },
    titleAlignment: { type: "string", default: "left" }
  },
  example: {
    attributes: {
      question: "What is my name?",
      correctAnswer: 2,
      answers: ["John", "Jane", "Joe", "Jim"],
      bgColor: "#CFE8FA",
      titleAlignment: "center"
    }
  },
  edit: EditComponent,
  save: function (props) {
    return null
  }
})

function EditComponent(props) {
  const blockProps = useBlockProps({
    className: "custom-edit-block",
    style: { backgroundColor: props.attributes.bgColor }
  })

  function updateQuestion(value) {
    props.setAttributes({ question: value })
  }

  function deleteAnswer(indexToDelete) {
    const newAnswers = props.attributes.answers.filter((x, index) => {
      return index !== indexToDelete
    })

    props.setAttributes({ answers: newAnswers })

    if (indexToDelete === props.attributes.correctAnswer) {
      props.setAttributes({ correctAnswer: undefined })
    }
  }

  function markAsCorrect(index) {
    props.setAttributes({ correctAnswer: index })
  }

  return (
    <div {...blockProps} >
      <BlockControls>
        <AlignmentToolbar value={props.attributes.titleAlignment} onChange={(x) => props.setAttributes({ titleAlignment: x })} />
      </BlockControls>
      <InspectorControls>
        <PanelBody title="Background Color" initialOpen={true}>
          <PanelRow>
            <ColorPicker color={props.attributes.bgColor} onChangeComplete={(x) => props.setAttributes({ bgColor: x.hex })} enableAlpha />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <TextControl label="Question:" value={props.attributes.question} onChange={updateQuestion} style={{ fontSize: "20px" }} />
      <p style={{ fontSize: "13px", margin: "20px 0 8px 0" }}>Answers:</p>
      {props.attributes.answers.map((answer, index) =>
        <Flex>
          <FlexBlock>
            <TextControl value={answer} onChange={newValue => {
              const newAnswers = props.attributes.answers.concat([])
              newAnswers[index] = newValue
              props.setAttributes({ answers: newAnswers })
            }} />
          </FlexBlock>
          <FlexItem>
            <Button onClick={() => markAsCorrect(index)}>
              <Icon className="mark-as-correct" icon={props.attributes.correctAnswer === index ? "star-filled" : "star-empty"} />
            </Button>
          </FlexItem>
          <FlexItem>
            <Button variant="link" className="delete-answer" onClick={() => deleteAnswer(index)}>Delete</Button>
          </FlexItem>
        </Flex>
      )}
      <Button variant="primary" onClick={() => {
        props.setAttributes({ answers: props.attributes.answers.concat([""]) })
      }}>Add another answer:</Button>
    </div>
  )
}