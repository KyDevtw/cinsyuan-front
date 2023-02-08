import React from "react";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Modal from "react-modal";
import Swal from "sweetalert2";

import pStyles from "../../styles/purchaseModal.module.scss";

// utils
import { countries, townships, postcodes } from "../../utils/address";
import currencyFormat from "../../utils/currencyFormat";

export default function PurchaseModal(props) {
  const {
    visable,
    setVisable,
    line,
    data,
    setData,
    func,
    delivery,
    setDelivery,
    errorText,
    step,
    setStep,
    theme
  } = props;

  //  step 2
  const [country, setCountry] = React.useState(-1);
  const [township, setTownship] = React.useState(-1);
  const [city, setCity] = React.useState("");

  // function checkLoginState() {
  //   FB.getLoginStatus(function (response) {
  //     console.log(response);
  //   });
  // }

  return (
    <Modal
      isOpen={visable}
      onRequestClose={() => {
        setVisable(false);
      }}
      contentLabel="purchase modal"
      ariaHideApp={false}
      style={{
        overlay: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "#00000099",
          overflow: "auto",
          paddingTop: "57px",
          zIndex: 12,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          justifyItems: "flex-start",
          alignContent: "flex-start",
          padding: "30px 20px",
          position: "absolute",
          inset: "auto",
          overflow: "visible",
          borderRadius: "0px",
        },
      }}
    >
      <div
        className={[pStyles.modal_close, pStyles[theme.theme]].join(" ")}
        onClick={() => {
          setVisable(false);
        }}
      />
      <div className={pStyles.main}>
        <div className={pStyles.head}>
          <div
            className={
              step === 0
                ? [pStyles.state, pStyles.active].join(" ")
                : step > 0
                ? [pStyles.state, pStyles.pre_state].join(" ")
                : pStyles.state
            }
          >
            <div className={pStyles.dot}></div>
            <p>付款方式</p>
          </div>
          <div
            className={
              step === 1
                ? [pStyles.state, pStyles.active].join(" ")
                : step > 1
                ? [pStyles.state, pStyles.pre_state].join(" ")
                : pStyles.state
            }
          >
            <div className={pStyles.dot}></div>
            <p>收件資料</p>
          </div>
          <div
            className={
              step === 2
                ? [pStyles.state, pStyles.active].join(" ")
                : step > 2
                ? [pStyles.state, pStyles.pre_state].join(" ")
                : pStyles.state
            }
          >
            <div className={pStyles.dot}></div>
            <p>補充備註</p>
          </div>
        </div>
        {step === 0 && StepOne ? (
          <StepOne data={data} setData={setData} line={line} theme={theme} />
        ) : step === 1 && StepTwo ? (
          <StepTwo
            data={data}
            setData={setData}
            errorText={errorText}
            country={country}
            setCountry={setCountry}
            delivery={delivery}
            township={township}
            setTownship={setTownship}
            city={city}
            setCity={setCity}
            line={line}
            theme={theme}
            // fbLogin={checkLoginState}
          />
        ) : (
          <StepThree
            data={data}
            setData={setData}
            errorText={errorText}
            delivery={delivery}
            setDelivery={setDelivery}
            township={township}
            setTownshipt={setTownship}
            line={line}
            theme={theme}
          />
        )}
      </div>
      <div className={pStyles.modal_footer}>
        <div className={pStyles.footer_text}>
          <p className={pStyles.transport_text}>
            {data.transportTypeId === 1
              ? "黑貓宅配"
              : data.transportTypeId === 2
              ? "全家超取"
              : data.transportTypeId === 3
              ? "7-11超取"
              : data.transportTypeId === 4
              ? "萊爾富超取"
              : "賣家宅配"}
          </p>
          <h6 className={pStyles.total_text}>總計</h6>
        </div>
        <div className={pStyles.footer_price}>
          <p className={pStyles.transport_price}>
            +NT${" "}
            {data.cp < 1500 && data.transportTypeId === 1
              ? 130
              : data.cp < 1500 && data.transportTypeId === 2
              ? 70
              : data.cp < 1500 && data.transportTypeId === 3
              ? 70
              : data.cp < 1500 && data.transportTypeId === 4
              ? 70
              : data.cp < 1500 && data.transportTypeId === 5
              ? 100
              : 0}
          </p>
          <p className={pStyles.total_price}>
            NT{currencyFormat(data.payment)}
          </p>
        </div>
        <div
          className={[pStyles.modal_btn_zone, pStyles[theme.theme]].join(" ")}
        >
          {step >= 1 ? (
            <button
              className={pStyles.modal_btn_pre}
              onClick={() => {
                if (step >= 1 && step < 3) {
                  setStep(step - 1);
                } else {
                  return;
                }
              }}
            >
              上一步
            </button>
          ) : (
            <></>
          )}
          <button
            className={pStyles.modal_btn_next}
            onClick={() => {
              if (step === 0) {
                setStep(step + 1);
              } else if (step === 1) {
                if (
                  data.name !== "" &&
                  data.phone !== "" &&
                  data.email !== "" &&
                  data.areaId !== Number &&
                  data.address !== ""
                ) {
                  setStep(step + 1);
                } else {
                  Swal.fire({
                    position: "bottom-end",
                    width: 280,
                    padding: "5px 10px",
                    icon: "warning",
                    title: `<p style="line-height: 25px;">${"請確實輸入收件資訊"}</p>`,
                    showConfirmButton: false,
                    backdrop: false,
                    toast: true,
                    timer: 5000,
                  });
                }
              } else {
                if (step === 2) {
                  func();
                }
              }
            }}
          >
            下一步
          </button>
        </div>
      </div>
      <div className={pStyles.line}>
        <p>不會訂購嗎？直接私訊客服求助，<br /> 也可以幫你下單哦！</p>
        <button
          onClick={() => {
            line();
          }}
        >
          LINE 客服
        </button>
      </div>
      <div className={pStyles.for_btm}></div>
    </Modal>
  );
}

function StepOne(props) {
  const { data, setData, line, theme } = props;
  return (
    <div className={[pStyles.content, pStyles[theme.theme]].join(" ")}>
      <div className={pStyles.section}>
        <h6>購物車小計</h6>
        <p className={pStyles.cart_total}>NT{currencyFormat(data.cp)}</p>
      </div>
      <div className={pStyles.section}>
        <h6 className={pStyles.section_des}>
          商品將於營業日 <span className={pStyles.high_light}>3~5天</span>{" "}
          內幫您出貨，如有急需請留言告知
        </h6>
        <h6 className={pStyles.section_des}>
          我們提供海外寄送服務，國際包裹運費實收，歡迎有需要的朋友私訊洽詢。
        </h6>
      </div>
      <div className={pStyles.section}>
        <p className={pStyles.section_require}>必填</p>
        <h6 className={pStyles.option_des}>運送方式</h6>
        <div
          className={[pStyles.option, pStyles.disabled].join(" ")}
          onClick={() => {
            // setData({ ...data, transportTypeId: 1 });
          }}
        >
          <div
            className={
              data.transportTypeId === 1
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>黑貓宅配 (+130)</p>
        </div>
        <div
          // className={pStyles.option}
          className={[pStyles.option, pStyles.disabled].join(" ")}
          onClick={() => {
            // setData({ ...data, transportTypeId: 2 });
          }}
        >
          <div
            className={
              data.transportTypeId === 2
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>全家超取 (+70)</p>
        </div>
        <div
          // className={pStyles.option}
          className={[pStyles.option, pStyles.disabled].join(" ")}
          onClick={() => {
            // setData({ ...data, transportTypeId: 3 });
          }}
        >
          <div
            className={
              data.transportTypeId === 3
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>7-11超取 (+70)</p>
        </div>
        <div
          // className={pStyles.option}
          className={[pStyles.option, pStyles.disabled].join(" ")}
          onClick={() => {
            // setData({ ...data, transportTypeId: 4 });
          }}
        >
          <div
            className={
              data.transportTypeId === 4
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>萊爾富超取 (+70)</p>
        </div>
        <div
          className={pStyles.option}
          onClick={() => {
            setData({ ...data, transportTypeId: 5 });
          }}
        >
          <div
            className={
              data.transportTypeId === 5
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>賣家宅配 (+100)</p>
        </div>
      </div>
      <div className={pStyles.section}>
        <p className={pStyles.section_require}>必填</p>
        <h6 className={pStyles.option_des}>付款方式</h6>
        <div
          className={pStyles.option}
          onClick={() => {
            setData({ ...data, paymentTypeId: 1 });
          }}
        >
          <div
            className={
              data.paymentTypeId === 1
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>信用卡（綠界支付）</p>
        </div>
        <div
          className={pStyles.option}
          onClick={() => {
            setData({ ...data, paymentTypeId: 2 });
          }}
        >
          <div
            className={
              data.paymentTypeId === 2
                ? [pStyles.radio, pStyles.active].join(" ")
                : pStyles.radio
            }
          ></div>
          <p className={pStyles.radio_option}>LINE PAY</p>
        </div>
      </div>
      {/* <div className={pStyles.line}>
        <p>不會訂購嗎？直接私訊客服求助，也可以幫你下單哦！</p>
        <button
          onClick={() => {
            line();
          }}
        >
          LINE 客服
        </button>
      </div> */}
    </div>
  );
}

function StepTwo(props) {
  const {
    data,
    setData,
    country,
    setCountry,
    delivery,
    city,
    setCity,
    township,
    setTownship,
    line,
    fbLogin,
    errorText,
    theme
  } = props;
  return (
    <div className={[pStyles.content, pStyles[theme.theme]].join(" ")}>
      {/* <button
        className={pStyles.fb}
        onClick={() => {
          fbLogin();
        }}
      >
        用 facebook 快速登入
      </button> */}
      <div className={pStyles.section}>
        <p className={pStyles.section_require}>必填</p>
        <h6 className={pStyles.option_des}>
          收件人
          <span className={pStyles.error_text}>
            {errorText && errorText.name}
          </span>
        </h6>
        <input
          value={data.name}
          type="text"
          placeholder="( 中文姓名2~5個字, 英文姓名4~10個字元 )"
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
      </div>
      <div className={pStyles.section}>
        <p className={pStyles.section_require}>必填</p>
        <h6 className={pStyles.option_des}>
          聯絡電話
          <span className={pStyles.error_text}>
            {errorText && errorText.phone}
          </span>
        </h6>
        <PhoneInput
          value={data.phone}
          className={pStyles.phone_input}
          onChange={(v) => {
            setData({ ...data, phone: v });
          }}
          defaultCountry="TW"
          countryCallingCodeEditable={false}
          international={false}
          placeholder="09xx xxx xxx"
        />
      </div>
      {delivery === 1 || delivery === 5 ? (
        <>
          <div className={pStyles.section}>
            <p className={pStyles.section_require}>必填</p>
            <h6 className={pStyles.option_des}>
              Email
              <span className={pStyles.error_text}>
                {errorText && errorText.email}
              </span>
            </h6>
            <input
              value={data.email}
              type="text"
              placeholder="建議填寫 Yahoo 以外的信箱"
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
          </div>
          <div className={pStyles.place}>
            <div className={pStyles.section}>
              <p className={pStyles.section_require}>必填</p>
              <h6 className={pStyles.option_des}>縣市</h6>
              <select
                value={country}
                onChange={(e) => {
                  // 將字串轉成數字
                  setCountry(+e.target.value);
                  // 重置township的值
                  setTownship(-1);
                  setCity("");
                }}
              >
                <option value="-1">請選擇</option>
                {countries.map((value, index) => (
                  <option key={index} value={index}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className={pStyles.section}>
              <p className={pStyles.section_require}>必填</p>
              <h6 className={pStyles.option_des}>區域</h6>
              <select
                value={township}
                onChange={(e) => {
                  // 將字串轉成數字
                  setTownship(+e.target.value);
                  setCity(townships[country][+e.target.value]);
                  setData({
                    ...data,
                    areaId: postcodes[country][+e.target.value],
                  });
                }}
                name=""
                id=""
              >
                <option value="-1">請選擇</option>
                {country > -1 &&
                  townships[country].map((value, index) => (
                    <option key={index} value={index}>
                      {value}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className={pStyles.section}>
            <h6 className={pStyles.option_des}>
              街道地址
              <span className={pStyles.error_text}>
                {errorText && errorText.address}
              </span>
            </h6>
            <input
              value={data.address}
              type="text"
              placeholder="不用重複輸入縣市區域"
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
              }}
            />
          </div>
        </>
      ) : (
        <div className={pStyles.section}>
          <h6 className={pStyles.option_des}>取貨超商</h6>
          <p className={pStyles.c_store}>尚未選擇超商</p>
          <button className={pStyles.link_store}>點擊選取超商</button>
        </div>
      )}
      {delivery === 1 ? (
        <div className={pStyles.section}>
          <h6 className={pStyles.option_des}>
            方便收貨時間 (確切送達時間可能因地區有所差異)
          </h6>
          <select
            value={data.pickupTimeId}
            onChange={(e) => {
              setData({ ...data, pickupTimeId: e.target.value });
            }}
          >
            <option value={1}>下午1點前</option>
            <option value={2}>下午2~6點</option>
            <option value={3}>不拘(預設)</option>
          </select>
        </div>
      ) : (
        <></>
      )}
      {/* <div className={pStyles.line}>
        <p>不會訂購嗎？直接私訊客服求助，也可以幫你下單哦！</p>
        <button
          onClick={() => {
            line();
          }}
        >
          LINE 客服
        </button>
      </div> */}
    </div>
  );
}

function StepThree(props) {
  const { data, setData, line, errorText, theme } = props;
  return (
    <div className={[pStyles.content, pStyles[theme.theme]].join(' ')}>
      <div className={pStyles.textarea_content}>
        <textarea
          value={data.memo}
          className={pStyles.textarea}
          placeholder="有什麼特殊需求可以填寫告知 (沒有則不需填寫)"
          onChange={(e) => {
            setData({ ...data, memo: e.target.value });
          }}
        />
        <p className={pStyles.note}>
          備註
          <span className={pStyles.error_text}>
            {errorText && errorText.memo}
          </span>
        </p>
      </div>
      <ul className={pStyles.ul}>
        <li>
          響應發票無紙化，於本網站消費開立之統一發票不隨貨寄出，相關資訊詳見電子發票說明。
        </li>
        <li>
          依統一發票使用辦法規定：公司戶發票一經開立，無法更改為個人發票。請務必確認輸入之公司統編是否正確，一經開立不得要求更改。
        </li>
        <li>統編發票將於商品送達後15天內由綠界系統寄到您的電子信箱。</li>
      </ul>
      {/* <div className={pStyles.line}>
        <p>不會訂購嗎？直接私訊客服求助，也可以幫你下單哦！</p>
        <button
          onClick={() => {
            line();
          }}
        >
          LINE 客服
        </button>
      </div> */}
    </div>
  );
}
