import React, { useContext } from "react"
import { Heading, Box } from "@looker/components"
import styled from "styled-components"
import { ExtensionButton } from "../ExtensionButton"
import {
  ExtensionContext,
  ExtensionContextData,
  getCoreSDK
} from "@looker/extension-sdk-react"

export const CoreSDKFunctions = () => {
  const [messages, setMessages] = React.useState("")
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK

  const updateMessages = (message: string) => {
    setMessages(prevMessages => {
      const maybeLineBreak = prevMessages.length === 0 ? '' : '\n'
      return `${prevMessages}${maybeLineBreak}${message}`
    })
  }

  const allConnectionsClick = () => {
      sdk.all_connections()
      .then((response) => {
        if (response.ok) {
          response.value.forEach(connection => {
            updateMessages(connection.name || '')
          })
        } else {
          updateMessages('Error getting connections')
        }
      })
      .catch(error => updateMessages('Error getting connections'))
  }

  const searchFoldersClick = () => {
    sdk.search_folders({ parent_id: '1'})
    .then((response) => {
      if (response.ok) {
        updateMessages(JSON.stringify(response.value, null, 2))
      } else {
        updateMessages('Error invoking search folders')
      }
    })
    .catch(error => updateMessages('Error invoking search folders'))
  }

  const inlineQueryClick = () => {
    // alternate mechanism to get sdk.
    getCoreSDK()
      .run_inline_query({
        result_format: "json_detail",
        limit: 10,
        body: {
          total: true,
          model: "thelook",
          view: "users",
          fields: ["last_name", "gender"],
          sorts: [`last_name desc`]
        }
      })
      .then((response) => {
        if (response.ok) {
          updateMessages(JSON.stringify(response.value, null, 2))
        } else {
          updateMessages('Error invoking inline query')
        }
      })
      .catch(error => updateMessages('Error invoking inline query'))
  }

  const clearMessagesClick = () => {
    setMessages('')
  }

  return (
    <>
      <Heading my="xlarge">Core SDK Functions</Heading>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" width="50%">
          <ExtensionButton
              mt="small"
              variant="outline"
              onClick={allConnectionsClick}
            >
            All connections (get method)
          </ExtensionButton>
          <ExtensionButton
              mt="small"
              variant="outline"
              onClick={searchFoldersClick}
            >
            Search folders (get method with parameters)
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={inlineQueryClick}
          >
            Inline query (post method)
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={clearMessagesClick}
          >
            Clear messages
          </ExtensionButton>
        </Box>
        <Box width="50%" pr="large">
          <StyledPre>{messages}</StyledPre>
        </Box>
      </Box>
    </>
  )
}

const StyledPre = styled.pre`
  margin: 0 0 0 20px;
  border: 1px solid #c1c6cc;
  height: 100%;
  padding: 20px;
`