export default function dispatcher(dispatch, typePrefix, fun) {
  return dispatch({
    "type": `${typePrefix}_PENDING`,
    "payload": fun.then(success => dispatch({
          "type": `${typePrefix}_FULFILLED`,
          "payload": success
        })).catch(error => dispatch({
          "type": `${typePrefix}_REJECTED`,
          "payload": error,
        }))
  })
}