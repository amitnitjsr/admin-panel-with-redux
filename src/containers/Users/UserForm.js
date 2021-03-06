import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Form,
  Row,
} from 'reactstrap';
import InputUI from '../../UI/InputUI';
import { USER_URL } from '../../shared/allApiUrl';
import { crudAction } from '../../store/actions/common';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

function UserForm(props) {
  const initialFields = {
    name: "",
    email: "",
    passowrd: null
  }
  const [fields, setFields] = useState(initialFields);
  const [userId, setUserId] = useState(null);
  const { handleSubmit, register, errors } = useForm();
  const params = props.match.params;
  useEffect(() => {
    setUserId(params.userId)
    if (params.userId) props.crudActionCall(`${USER_URL}/${params.userId}`, null, "GET")
  }, [params])
  useEffect(() => {
    const action = props.user.action;
    if (props.user.user && params.userId) {
      setFields({ ...fields, ...props.user.user })
    }

    if (action.isSuccess && action.type === "ADD" || action.type === "UPDATE")
      props.history.push("/user/list")

  }, [props.user]);
  const onSubmit = (data) => {
    if (userId) data.userId = userId;
    props.crudActionCall(USER_URL, data, userId ? "UPDATE" : "ADD")
  }
  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <i className="fa fa-edit"></i>{userId ? `User Update` : `User Add`}
            </CardHeader>
            <Form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
              <CardBody>
                {/* First Name */}
                <InputUI
                  label="Name"
                  name="name"
                  errors={errors}
                  innerRef={register({
                    required: 'This is required field',
                  })}
                  errors={errors}
                  fields={fields}
                />
                {/* Email-ID */}
                <InputUI
                  label="Email"
                  name="email"
                  errors={errors}
                  innerRef={register({
                    required: 'This is required field',
                  })}
                  errors={errors}
                  fields={fields}
                />
                {!userId && <InputUI
                  label="Password"
                  name="password"
                  type="password"
                  errors={errors}
                  innerRef={register({
                    required: 'This is required field',
                  })}
                  errors={errors}
                  fields={fields}
                />}
                {/* Date Of Birth */}
                <InputUI
                  label="Date Of Birth"
                  name="dateOfBirth"
                  type="date"
                  errors={errors}
                  innerRef={register({
                    required: 'This is required field',
                  })}
                  errors={errors}
                  fields={fields}
                />
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
const mapStateToProps = state => {
  const { user } = state;
  return {
    user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    crudActionCall: (url, data, actionType) => dispatch(crudAction(url, data, actionType, "USER")),
    resetAction: () => dispatch({ type: "RESET_USER_ACTION" })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserForm));