import React, { useState } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import MyInput from "../../components/textFields/MyInput";
import MyDropdown from "../../components/textFields/MyDropdown";
import MyTextarea from "../../components/textFields/MyTextarea";
import MyToast from "../../components/toast/MyToast";
import MyButton from "../../components/button/MyButton";
import MyTabs from "../../components/tab/MyTab";
import "bootstrap/dist/css/bootstrap.min.css";
import "./restaurantform.css";

//  Type imports
import type {
  RestaurantFormValues, //type of form fields
  RestaurantTabKey, //key for tabs
} from "../../types/restaurantFormTypes";

//  Validation import
import {
  FIELD_LABELS,
  VALIDATION_RULES,
} from "../../utils/validators/restaurantFormValidation";

interface Props {
  show: boolean; //modal is visible or not
  onClose: () => void; //to close modal
}

const RestaurantForm: React.FC<Props> = ({ show, onClose }) => {
  const [activeTab, setActiveTab] =
    useState<RestaurantTabKey>("login"); //which tab is currently active

  const [showConfirm, setShowConfirm] = useState(false); //confirm toast is open or not
  const [actionType, setActionType] = useState<
    "register" | "reset" | "cancel" | null
  >(null); //which action is triggred

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  //  REACT HOOK FORM
  const {
    register, //connect form field with validation
    handleSubmit, //handle form submission
    formState: { errors }, //validation errors
    reset,
    trigger,
  } = useForm<RestaurantFormValues>({
    mode: "onChange", //when user type validation occur
  });

  //  SUBMIT
  const onSubmit = (data: RestaurantFormValues) => {
    setToastMsg("Restaurant registered successfully");
    setShowToast(true);
    console.log("Submitted Data:", data);
  };

  //  CONFIRMATION
  const handleConfirmOpen = (
    type: "register" | "reset" | "cancel"
  ) => {
    setActionType(type);
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    if (actionType === "register") {
      if (activeTab === "location") {
        const isValid = await trigger();
        if (!isValid) {
          setShowConfirm(false);
          return;
        }

        handleSubmit((data) => {
          onSubmit(data); // Toast will show here
          setShowConfirm(false);
        })();

        return;
      }

      // validate only current tab
      const isValid = await trigger(TAB_FIELDS[activeTab]);
      if (!isValid) {
        setShowConfirm(false);
        return;
      }

      goNext();
      setShowConfirm(false);
      return;
    }

    if (actionType === "reset") {
      reset();
      setToastMsg("Form reset successfully");
      setShowToast(true);
      setActiveTab("login");
      setShowConfirm(false);
      return;
    }

    if (actionType === "cancel") {
      onClose();
      setShowConfirm(false);
    }
  };

  //  which fields need validation tab wise
  const TAB_FIELDS: Record<
    RestaurantTabKey,
    (keyof RestaurantFormValues)[]
  > = {
    login: ["email", "password", "confirmPassword"],

    restaurant: ["restaurantName", "restaurantType", "category"],

    contact: [
      "ownerName",
      "supportEmail",
      "phone",
      "alternatePhone",
    ],

    location: [
      "address",
      "city",
      "state",
      "country",
      "pincode",
    ],
  };

  const tabOrder: RestaurantTabKey[] = [
    "login",
    "restaurant",
    "contact",
    "location",
  ];

  const goNext = () => {
    const index = tabOrder.indexOf(activeTab);
    if (index < tabOrder.length - 1) {
      setActiveTab(tabOrder[index + 1]);
    }
  };

  const goBack = () => {
    const index = tabOrder.indexOf(activeTab);
    if (index > 0) {
      setActiveTab(tabOrder[index - 1]);
    }
  };

  //  TAB CONTENTS
  const tabsData = [
    {
      tabName: "Login Details",
      tabContent: (
        <>
          {/* LOGIN DETAILS */}
          <Row>
            <Col md={12}>
              <MyInput
                label={FIELD_LABELS.email}
                placeholder="Enter email / username"
                {...register("email", VALIDATION_RULES.email)}
                required
                error={errors.email?.message}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <MyInput
                label={FIELD_LABELS.password}
                placeholder="Enter password"
                type="password"
                {...register("password", VALIDATION_RULES.password)}
                required
                error={errors.password?.message}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <MyInput
                label={FIELD_LABELS.confirmPassword}
                placeholder="Re-enter password"
                type="password"
                required
                {...register(
                  "confirmPassword",
                  VALIDATION_RULES.confirmPassword
                )}
                error={errors.confirmPassword?.message}
              />
            </Col>
          </Row>
        </>
      ),
    },

    {
      tabName: "Restaurant Details",
      tabContent: (
        <>
          {/* RESTAURANT DETAILS */}
          <Row>
            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.restaurantName}
                placeholder="Enter restaurant name "
                {...register(
                  "restaurantName",
                  VALIDATION_RULES.restaurantName
                )}
                required
                error={errors.restaurantName?.message}
              />
            </Col>

            <Col md={6}>
              <MyDropdown
                label={FIELD_LABELS.restaurantType}
                options={["Veg", "Non-Veg", "Both"]}
                {...register(
                  "restaurantType",
                  VALIDATION_RULES.restaurantType
                )}
                required
                error={errors.restaurantType?.message}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MyDropdown
                label={FIELD_LABELS.category}
                options={[
                  "Indian",
                  "Chinese",
                  "Fast Food",
                  "Italian",
                  "Mexican",
                ]}
                {...register(
                  "category",
                  VALIDATION_RULES.category
                )}
                required
                error={errors.category?.message}
              />
            </Col>

            <Col md={6}>
              <MyInput label="Upload Logo" type="file" />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MyInput label="Opening Time" type="time" />
            </Col>
            <Col md={6}>
              <MyInput label="Closing Time" type="time" />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MyDropdown
                label="Average Delivery Time"
                options={[
                  "20 mins",
                  "30 mins",
                  "45 mins",
                ]}
              />
            </Col>
            <Col md={6}>
              <MyInput
                label="Website / Social Link"
                placeholder="Enter your website link"
                type="url"
              />
            </Col>
          </Row>
        </>
      ),
    },

    {
      tabName: "Contact Info",
      tabContent: (
        <>
          {/* CONTACT */}
          <Row>
            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.ownerName}
                placeholder="Enter your name "
                {...register(
                  "ownerName",
                  VALIDATION_RULES.ownerName
                )}
                required
                error={errors.ownerName?.message}
              />
            </Col>

            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.supportEmail}
                placeholder="Enter email"
                {...register(
                  "supportEmail",
                  VALIDATION_RULES.supportEmail
                )}
                required
                error={errors.supportEmail?.message}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.phone}
                placeholder="Enter phone no"
                {...register("phone", VALIDATION_RULES.phone)}
                required
                error={errors.phone?.message}
              />
            </Col>

            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.alternatePhone}
                placeholder="Alternate phone no"
              />
            </Col>
          </Row>
        </>
      ),
    },

    {
      tabName: "Location Details",
      tabContent: (
        <>
          {/* LOCATION */}
          <Row>
            <Col md={12}>
              <MyTextarea
                label="Street / Address"
                {...register(
                  "address",
                  VALIDATION_RULES.address
                )}
                required
                placeholder="Enter full address"
                error={errors.address?.message}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.city}
                {...register("city", VALIDATION_RULES.city)}
                required
                placeholder="Enter city "
                error={errors.city?.message}
              />
            </Col>

            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.state}
                {...register(
                  "state",
                  VALIDATION_RULES.state
                )}
                required
                placeholder="Enter state "
                error={errors.state?.message}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.country}
                {...register(
                  "country",
                  VALIDATION_RULES.country
                )}
                placeholder="Enter country "
                error={errors.country?.message}
              />
            </Col>

            <Col md={6}>
              <MyInput
                label={FIELD_LABELS.pincode}
                {...register(
                  "pincode",
                  VALIDATION_RULES.pincode
                )}
                placeholder="Enter pincode"
                error={errors.pincode?.message}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      {/* MAIN FORM MODAL */}
      <Modal
        show={show}
        onHide={onClose}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">
            Register Your Restaurant
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/*rhf handlesubmit to trigger onsubmit*/}

            <MyTabs
              tabs={tabsData}
              activeTab={tabOrder.indexOf(activeTab)}
              onTabChange={(index) =>
                setActiveTab(tabOrder[index])
              }
            />
          </Form>
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer className="border-0">
          <div className="w-100 d-flex align-items-center">
            {/* LEFT */}
            <div
              className="footer-side d-flex justify-content-start"
              style={{ width: "150px" }}
            >
              {activeTab !== "login" && (
                <MyButton
                  className="btn-back"
                  onClick={goBack}
                >
                  Back
                </MyButton>
              )}
            </div>

            {/* CENTER */}
            <div className="footer-center d-flex justify-content-center flex-grow-1 gap-2">
              <MyButton
                className="btn-save"
                onClick={() =>
                  handleConfirmOpen("register")
                }
              >
                {activeTab === "location"
                  ? "Save & Register"
                  : "Save"}
              </MyButton>

              <MyButton
                className="btn-reset"
                onClick={() =>
                  handleConfirmOpen("reset")
                }
              >
                Reset
              </MyButton>
            </div>

            {/* RIGHT */}
            <div
              className="footer-side d-flex justify-content-end"
              style={{ width: "150px" }}
            >
              {activeTab !== "location" && (
                <MyButton
                  className="btn-next"
                  onClick={goNext}
                >
                  Next
                </MyButton>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* CONFIRM */}
      <Modal show={showConfirm} centered size="sm">
        <Modal.Body className="text-center">
          Are you sure?
          <div className="d-flex justify-content-center gap-2 mt-3">
            <MyButton
              onClick={() => setShowConfirm(false)}
            >
              No
            </MyButton>
            <MyButton
              className="btn-save"
              onClick={handleConfirmYes}
            >
              Yes
            </MyButton>
          </div>
        </Modal.Body>
      </Modal>

      <MyToast
        show={showToast}
        message={toastMsg}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default RestaurantForm;
