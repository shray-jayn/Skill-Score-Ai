import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { uploadService } from "../services/upload.service";
import { FetchSessionsDropdownResponse } from "../models/upload/upload.model";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

const { Dragger } = Upload;
const { Option } = Select;

const UploadComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coachingRound, setCoachingRound] = useState<string>("1");
  const [fileUrl,setFileUrl ] = useState<string>("");
  const [dropdownData, setDropdownData] = useState<FetchSessionsDropdownResponse["data"]>([]);
  const auth = useRecoilValue(authState);
  

  const handleTeamNameChange = async (value: string) => {
    try {
      const response = await uploadService.checkTeamName({ teamName: value });
      if (response.exists) {
        message.error(`The team name "${value}" already exists.`);
        form.setFields([
          {
            name: "teamName",
            errors: ["Team name already exists"],
          },
        ]);
      } else {
        form.setFields([
          {
            name: "teamName",
            errors: [],
          },
        ]);
      }
    } catch (error) {
      console.error("Error checking team name:", error);
      message.error("Failed to validate team name.");
    }
  };

  const handleTableStats = async () => {
    try {

      const userId = auth.user?.userId;
      
      if (!userId) {
        message.error("User ID not found");
        return;
      }

      const response = await uploadService.fetchSessionsDropdown({ userId: userId});
      setDropdownData(response.data);
      if (response.success) {


       
      } else {
        
      }
    } catch (error) {
      console.error("Error checking team name:", error);
      message.error("Failed to validate team name.");
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
  
      // Sanitize file name
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  
      // Generate SAS token and blob URL
      const response = await uploadService.generateSas({ filename: sanitizedFileName });
      const { sasUrl, blobUrl } = response;
  
      setFileUrl(blobUrl); // Store the blob URL for further use
  
      // Use fetch to include custom headers
      const result = await fetch(`${sasUrl}`, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type, // Set the correct content type
        },
        body: file,
      });
  
      if (!result.ok) {
        throw new Error(`Upload failed with status ${result.status}`);
      }
  
      // Show success message
      message.success(`${sanitizedFileName} uploaded successfully.`);
      form.setFieldValue("fileUrl", blobUrl); // Update the form with the blob URL
      setSelectedFile(null); // Reset selected file
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("File upload failed.");
    } finally {
      setUploading(false); // Reset uploading state
    }
  };
  
  const handleAnalyze = async (values: any) => {
    try {
      const userId = auth.user?.userId;
  
      if (!userId) {
        message.error("User ID not found");
        return;
      }
  
      let teamName = "";
      let coacheeName1 = "";
      let coacheeName2 = "";
      let coacheeName3 = "";
      const coachingRound = values.coachingRound;
  
      // Extract form data based on coachingRound
      if (coachingRound === "1") {
        teamName = values.teamName;
        coacheeName1 = values.coach1;
        coacheeName2 = values.coach2;
        coacheeName3 = values.coach3;
      } else if (coachingRound === "2") {
        teamName = values.teamName;
        coacheeName1 = values.coach1;
        coacheeName2 = values.coach2;
        coacheeName3 = values.coach3;
      }
  
      // Ensure the fileUrl (blobUrl) is available
      if (!fileUrl) {
        message.error("File not uploaded. Please upload a file before analyzing.");
        return;
      }
  
      // Format the recording date
      const formattedDate = values.recordingDate.format("YYYY-MM-DD");
      const language = values.language;
  
      // Construct payload
      const payload = {
        formattedDate,
        teamName,
        language,
        coachingRound,
        coacheeName1,
        coacheeName2,
        coacheeName3,
        userId,
        url: fileUrl, // Renaming blobUrl to url
      };
  
      console.log("Payload:", payload);
  
      // Send analysis request
      await uploadService.analyze(payload);
      message.success("Analysis initiated successfully!");
  
      // Reset form fields after submission
      form.resetFields();
    } catch (error) {
      console.error("Error analyzing data:", error);
      message.error("Analysis failed.");
    }
  };  



  return (
<Card style={{ maxWidth: 1200, margin: "auto", marginTop: 20, padding: 24 }}>
 
      <Form form={form} onFinish={handleAnalyze}  initialValues={{ coachingRound: "1" }} layout="vertical">
        <Row gutter={32}>
          {/* Left Section - Form Fields */}
         <Col xs={24} md={12}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Recording Date" name="recordingDate" rules={[{ required: true, message: "Please select a recording date" }]}> 
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Coaching Round" name="coachingRound"  rules={[{ required: true, message: "Please select a coaching round" }]}> 
                  <Select placeholder="Select Coaching Round" style={{ width: "100%" }} onChange={(value) => {
              setCoachingRound(value);
              if (value === "2") {
                handleTableStats();
              }
            }}>
                    <Option value="1">Round 1</Option>
                    <Option value="2">Round 2</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Team Name" name="teamName"  rules={[{ required: true, message: "Please enter a team name" }]}> 
              <Input placeholder="Enter Unique Team Name" onChange={(e) => handleTeamNameChange(e.target.value)} />
            </Form.Item>

             <Form.Item label="Coach Names" 
                        >
                          <Row gutter={[16, 16]}>
                            <Col span={8}>
                              <Form.Item
                                name="coach1"
                                rules={[{ required: true, message: "Please enter Coach Name 1" }]}
                              >
                                <Input placeholder="Coach Name 1" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name="coach2"
                                rules={[{ required: true, message: "Please enter Coach Name 2" }]}
                              >
                                <Input placeholder="Coach Name 2" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name="coach3"
                                rules={[{ required: true, message: "Please enter Coach Name 3" }]}
                              >
                                <Input placeholder="Coach Name 3" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form.Item>

            <Form.Item label="Language" name="language"  rules={[{ required: true, message: "Please select a language" }]}> 
              <Select placeholder="Select a language" style={{ width: "100%" }}>
                <Option value="english">English</Option>
                <Option value="spanish">Spanish</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Right Section - File Upload and Analyze Button */}
          <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Dragger  beforeUpload={(file) => {
            handleFileUpload(file); // Upload the file directly
            return false; // Prevent automatic upload
          }} style={{ width: "100%", maxWidth: 500, height: 160, marginBottom: 16 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to upload</p>
               <p className="ant-upload-hint">Support for a single upload. Avoid uploading sensitive data.</p>
            </Dragger>
            
            <Button disabled={uploading} type="primary" htmlType="submit" style={{ marginTop: 70, width: "50%", minWidth: 140, height: 40, textAlign: "center" }}>Analyze</Button>
          </Col>
        </Row>
      </Form>
    </Card>

  )
};

export default UploadComponent;
