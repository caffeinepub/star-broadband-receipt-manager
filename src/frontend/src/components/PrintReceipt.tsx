import type { Receipt } from "../backend.d.ts";

interface PrintReceiptProps {
  receipt: Receipt;
}

const SPEED_PLANS = [
  "20 MBPS",
  "30 MBPS",
  "40 MBPS",
  "50 MBPS",
  "75 MBPS",
  "100 MBPS",
];
const DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

export function PrintReceipt({ receipt }: PrintReceiptProps) {
  return (
    <div
      id="print-receipt"
      className="receipt-paper"
      style={{
        width: "100%",
        maxWidth: "780px",
        margin: "0 auto",
        border: "2px solid #000",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        backgroundColor: "#fff",
        color: "#000",
        lineHeight: "1.3",
      }}
    >
      {/* Header Row */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {/* Left: Customer Copy / SALE labels */}
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 6px",
                verticalAlign: "top",
                width: "110px",
                minWidth: "90px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: "bold",
                  border: "1px solid #000",
                  padding: "2px 4px",
                  textAlign: "center",
                  marginBottom: "2px",
                }}
              >
                Customer Copy
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "900",
                  border: "2px solid #000",
                  padding: "2px 6px",
                  textAlign: "center",
                }}
              >
                SALE
              </div>
            </td>

            {/* Center: Company Name + Tagline */}
            <td
              style={{
                border: "1px solid #000",
                padding: "6px 10px",
                verticalAlign: "top",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "900",
                  letterSpacing: "1px",
                  lineHeight: "1.1",
                }}
              >
                ★ STAR BROADBAND
              </div>
              <div
                style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}
              >
                Stay Connected
              </div>
              <div
                style={{ fontSize: "8.5px", marginTop: "4px", color: "#333" }}
              >
                <strong>GST:</strong> 27AAMCS9406K1ZR &nbsp;&nbsp;
                <strong>AGR:</strong> 821-80/2014-DS
              </div>
              <div
                style={{ fontSize: "8.5px", marginTop: "2px", color: "#333" }}
              >
                Mahatma Jyotiba Phule Nagar, Nr. Water Tank, Ambernath (W).
              </div>
            </td>

            {/* Right: Contact Numbers */}
            <td
              style={{
                border: "1px solid #000",
                padding: "6px 10px",
                verticalAlign: "top",
                width: "155px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "10px", marginBottom: "3px" }}>
                📞 <strong>8855001127</strong>
              </div>
              <div style={{ fontSize: "10px", marginBottom: "3px" }}>
                📱 <strong>9764744578</strong>
              </div>
              <div style={{ fontSize: "10px" }}>
                📞 <strong>9022119244</strong>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Receipt No / Date / Expiry Row */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                fontWeight: "bold",
              }}
            >
              No.{" "}
              <span style={{ fontWeight: "normal" }}>{receipt.receiptNo}</span>
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                fontWeight: "bold",
              }}
            >
              Date: <span style={{ fontWeight: "normal" }}>{receipt.date}</span>
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                fontWeight: "bold",
              }}
            >
              Date of Expiry:{" "}
              <span style={{ fontWeight: "normal" }}>
                {receipt.dateOfExpiry}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* User ID / Mobile Row */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                width: "60%",
              }}
            >
              <strong>User ID:</strong> {receipt.userId}
            </td>
            <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
              <strong>Mob.</strong> {receipt.mobile}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Name + Total / Balance / GST / Grand Total */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              rowSpan={4}
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                verticalAlign: "top",
                width: "58%",
              }}
            >
              <div style={{ marginBottom: "6px" }}>
                <strong>Name:</strong> {receipt.customerName}
              </div>
              <div style={{ marginBottom: "4px" }}>
                <strong>Address:</strong> {receipt.address}
              </div>
              <div style={{ marginBottom: "4px" }}>
                <strong>Installation Charges</strong>{" "}
                <span style={{ fontSize: "9px" }}>(Non-refundable)</span>: ₹
                {receipt.installationCharges}
              </div>
              <div>
                <strong>Package Value:</strong> ₹{receipt.packageValue}
              </div>
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                width: "20%",
                fontWeight: "bold",
              }}
            >
              Total
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                width: "22%",
                textAlign: "right",
              }}
            >
              ₹{receipt.total}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                fontWeight: "bold",
              }}
            >
              Balance
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                textAlign: "right",
              }}
            >
              ₹{receipt.balance}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                fontWeight: "bold",
              }}
            >
              GST
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px 8px",
                textAlign: "right",
              }}
            >
              ₹{receipt.gst}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "2px solid #000",
                padding: "5px 8px",
                fontWeight: "900",
                fontSize: "12px",
                backgroundColor: "#f0f0f0",
              }}
            >
              Grand Total
            </td>
            <td
              style={{
                border: "2px solid #000",
                padding: "5px 8px",
                fontWeight: "900",
                fontSize: "12px",
                textAlign: "right",
                backgroundColor: "#f0f0f0",
              }}
            >
              ₹{receipt.grandTotal}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Speed Plan Row */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
              <strong>Speed Plan: </strong>
              {SPEED_PLANS.map((plan, i) => (
                <span key={plan}>
                  {i > 0 && <span style={{ color: "#666" }}> / </span>}
                  <span
                    style={{
                      fontWeight: plan === receipt.speedPlan ? "900" : "normal",
                      textDecoration:
                        plan === receipt.speedPlan ? "underline" : "none",
                      fontSize: plan === receipt.speedPlan ? "12px" : "11px",
                    }}
                  >
                    {plan}
                  </span>
                </span>
              ))}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
              <strong>Duration: </strong>
              {DURATIONS.map((dur, i) => (
                <span key={dur}>
                  {i > 0 && <span style={{ color: "#666" }}> / </span>}
                  <span
                    style={{
                      fontWeight: dur === receipt.duration ? "900" : "normal",
                      textDecoration:
                        dur === receipt.duration ? "underline" : "none",
                      fontSize: dur === receipt.duration ? "12px" : "11px",
                    }}
                  >
                    {dur}
                  </span>
                </span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Payment Status Stamp */}
      {receipt.paymentStatus === "Paid" && (
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "16px",
              top: "-24px",
              border: "3px solid #16a34a",
              borderRadius: "4px",
              padding: "2px 10px",
              color: "#16a34a",
              fontWeight: "900",
              fontSize: "16px",
              transform: "rotate(-12deg)",
              opacity: 0.85,
              letterSpacing: "2px",
            }}
          >
            PAID ✓
          </div>
        </div>
      )}
      {receipt.paymentStatus === "Unpaid" && (
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "16px",
              top: "-24px",
              border: "3px solid #dc2626",
              borderRadius: "4px",
              padding: "2px 10px",
              color: "#dc2626",
              fontWeight: "900",
              fontSize: "16px",
              transform: "rotate(-12deg)",
              opacity: 0.85,
              letterSpacing: "2px",
            }}
          >
            UNPAID
          </div>
        </div>
      )}

      {/* Terms & Conditions Row */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px 8px",
                verticalAlign: "top",
                width: "75%",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  fontSize: "10px",
                }}
              >
                Terms &amp; Conditions:
              </div>
              <ol
                style={{
                  paddingLeft: "14px",
                  margin: 0,
                  fontSize: "9px",
                  lineHeight: "1.5",
                }}
              >
                <li style={{ marginBottom: "3px" }}>
                  The Service Provider is not liable for any damage if the same
                  happens due to thundering of Electric Current Fluctuation and
                  by Act of Nature.
                </li>
                <li style={{ marginBottom: "3px" }}>
                  Charges paid is neither refundable, not transferable under any
                  circumstances.
                </li>
                <li style={{ marginBottom: "3px" }}>
                  Customer are requested to registered the complaint between
                  10.00 am to 8.00 pm. Complaint will be attended at office
                  timing only.
                </li>
              </ol>
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px 8px",
                verticalAlign: "bottom",
                textAlign: "center",
                width: "25%",
              }}
            >
              {/* QR Code placeholder */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  border: "1px solid #999",
                  margin: "0 auto 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f9f9f9",
                  fontSize: "8px",
                  color: "#aaa",
                }}
              >
                QR
              </div>
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: "4px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              >
                Receiver's
                <br />
                Signature
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
