import React, {useState, useEffect, useCallback, useContext} from 'react';
import Router, { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

// Internal Import
import { VotingContext } from '../context/Voter';
import Style from '../styles/allowedVoters.module.css';
import images from '../assets';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';


const allowedVoters = () =>{
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: '',
    address: '',
    position: '',
  });

  const router = useRouter();
  const {uploadToIPFS, createVoter} = useContext(VotingContext);

  // VOTERS IMAGE DROP
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  });

  const {getRootProps, getInputProps}= useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });



  // --------------------JSX PART----------------------------------------------
  return(
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name:&nbsp; <span>{formInput.name}</span>{" "}
              </p>
              <p>
                Address:&nbsp; <span>{formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Position:&nbsp; <span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}

        {
          !fileUrl && (
            <div className={Style.sideInfo}>
              <div className={Style.sideInfo_box}>
                <h4>Create Candidate for Voting</h4>
                <p>
                  Blockchain Voting Organisation, provide ethereum blockchain ecosystem
                </p>
                <p className={Style.sideInfo_para}>Contract Candidate List</p>
              </div>

              {/* <div className={Style.card}>
                  {voterArray.map((el,i) => (
                    <div key={i+1} className={Style.card_box}>
                      <div className={Style.image}>
                        <img src="" alt="Profile photo"/>
                      </div>
                      
                      <div className={Style.card_info}>
                        <p>Name</p>
                        <p>Address</p>
                        <p>Details</p>
                      </div>
                    </div>
                  )
                  )}
              </div> */}

            </div>
          )}
      </div>


      <div className={Style.voter}>
        <div className={Style.voter_container}>
              <h1>Create New Voter</h1>
              <div className={Style.voter_container_box}>
                <div className={Style.voter_container_box_div}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()}/>

                    <div className={Style.voter_container_box_div_info}>
                      <p>Upload File : JPG PNG GIF WEBM Max 10 MB</p>

                      <div className={Style.voter_container_box_div_image}>
                        <Image src={images.upload} width={150} height={150} objectFit="contain" alt='File Upload'/>
                        </div>

                        <p>Drag & Drop file</p>
                        <p>or Browse on your Device</p>
                    </div>
                  </div>
                </div>
              </div>
        </div>


        <div className={Style.input_container}>
        <Input
            inputType="text"
            title="Name"
            placeholder="Voter Name"
            handleclick={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleclick ={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Voter Position"
            handleclick={(e) =>
              setFormInput({ ...formInput, position: e.target.value })
            }
          />
        
        <div className={Style.Button}>
          <Button btnName="Authorised Voter" handleClick={ () => createVoter(formInput, fileUrl, router) } />
        </div>
        </div>
      </div>

      {/*///////////////  CREATED VOTER SECTION */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <Image src={images.creator} alt="User Profile Photo" />
          <p>Notice for User</p>
          <p>Organiser<span>0x93999...</span></p>
          <p>
            Only Organiser of the voting contract can create Voter for Voting Election
          </p>
        </div>
      </div>

    </div>
  );
};


export default allowedVoters

// //with this e.target.value we can directly set the value of name (adv of react)