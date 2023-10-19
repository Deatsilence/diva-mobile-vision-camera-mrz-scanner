import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  MRZCamera,
  MRZScannerProps,
} from 'diva-mobile-vision-camera-mrz-scanner';

import type {MRZProperties} from '../types/mrzProperties';
import {parseMRZ} from '../util/mrzParser';

const MRZScanner: FC<PropsWithChildren<MRZScannerProps>> = ({
  style,
  skipButtonEnabled,
  skipButton,
  onSkipPressed,
  skipButtonStyle,
  cameraProps,
  onData,
  skipButtonText,
  mrzFinalResults,
  enableMRZFeedBack,
  numberOfQAChecks,
  enableBoundingBox,
  mrzFeedbackCompletedColor,
  mrzFeedbackUncompletedColor,
  mrzFeedbackContainer,
  mrzFeedbackTextStyle,
  isActiveCamera,
  languages,
}) => {
  //*****************************************************************************************
  //  setting up the state
  //*****************************************************************************************

  const numQAChecks = numberOfQAChecks ?? 3;
  const [scanSuccess, setScanSuccess] = useState(false);
  const [docMRZQAList, setDocMRZQAList] = useState<(string | undefined)[]>([]);
  const [docTypeQAList, setDocTypeQAList] = useState<(string | undefined)[]>(
    [],
  );
  const [issuingCountryQAList, setIssuingCountryQAList] = useState<
    (string | undefined)[]
  >([]);
  const [givenNamesQAList, setGivenNamesQAList] = useState<
    (string | undefined)[]
  >([]);
  const [lastNamesQAList, setLastNamesQAList] = useState<
    (string | undefined)[]
  >([]);
  const [idNumberQAList, setIdNumberQAList] = useState<(string | undefined)[]>(
    [],
  );
  const [nationalityQAList, setNationalityQAList] = useState<
    (string | undefined)[]
  >([]);
  const [dobQAList, setDobQAList] = useState<(string | undefined)[]>([]);
  const [genderQAList, setGenderQAList] = useState<(string | undefined)[]>([]);
  const [docExpirationDateQAList, setDocExpirationDateQAList] = useState<
    (string | undefined)[]
  >([]);
  const [isActive, setIsActive] = useState(true);
  const [additionalInformationQAList, setAdditionalInformationQAList] =
    useState<(string | undefined)[]>([]);

  useEffect(() => {
    return () => {
      setIsActive(false);
    };
  }, []);

  /**
   * If all elements in list match element, add the new element.
   * If not, empty the list, then add the new element to the list.
   * @param list
   * @param element
   */
  const mrzQACheck = (list: (string | undefined)[], element?: string) => {
    let newList = [...list];
    for (let i = 0; i < list.length; i++) {
      if (list[i] !== element) {
        newList = [];
      }
    }
    newList.push(element);
    return newList;
  };

  /**
   * Returns true if all QALists are full (their sizes are >= numberOfPreviousMRZsToCompareTo).
   * If one or more of them are not full, it updates them with the most recently captured field that pertains to them.
   * @param numberOfPreviousMRZsToCompareTo
   * @param mrzResults
   */
  const currentMRZMatchesPreviousMRZs = (
    numberOfPreviousMRZsToCompareTo: number,
    mrzResults: MRZProperties,
  ) => {
    if (
      docMRZQAList.length >= 1 &&
      docTypeQAList.length >= numberOfPreviousMRZsToCompareTo &&
      issuingCountryQAList.length >= numberOfPreviousMRZsToCompareTo &&
      givenNamesQAList.length >= numberOfPreviousMRZsToCompareTo &&
      lastNamesQAList.length >= numberOfPreviousMRZsToCompareTo &&
      idNumberQAList.length >= numberOfPreviousMRZsToCompareTo &&
      nationalityQAList.length >= numberOfPreviousMRZsToCompareTo &&
      dobQAList.length >= numberOfPreviousMRZsToCompareTo &&
      genderQAList.length >= numberOfPreviousMRZsToCompareTo &&
      docExpirationDateQAList.length >= numberOfPreviousMRZsToCompareTo &&
      issuingCountryQAList.length >= numberOfPreviousMRZsToCompareTo
    ) {
      return true;
    }
    if (givenNamesQAList.length < numberOfPreviousMRZsToCompareTo) {
      setGivenNamesQAList(mrzQACheck(givenNamesQAList, mrzResults.givenNames));
    }
    if (lastNamesQAList.length < numberOfPreviousMRZsToCompareTo) {
      setLastNamesQAList(mrzQACheck(lastNamesQAList, mrzResults.lastNames));
    }
    if (idNumberQAList.length < numberOfPreviousMRZsToCompareTo) {
      setIdNumberQAList(mrzQACheck(idNumberQAList, mrzResults.idNumber));
    }
    if (nationalityQAList.length < numberOfPreviousMRZsToCompareTo) {
      setNationalityQAList(
        mrzQACheck(nationalityQAList, mrzResults.nationality),
      );
    }
    if (dobQAList.length < numberOfPreviousMRZsToCompareTo) {
      setDobQAList(mrzQACheck(dobQAList, mrzResults.dob));
    }
    if (genderQAList.length < numberOfPreviousMRZsToCompareTo) {
      setGenderQAList(mrzQACheck(genderQAList, mrzResults.gender));
    }
    if (issuingCountryQAList.length < numberOfPreviousMRZsToCompareTo) {
      setIssuingCountryQAList(
        mrzQACheck(issuingCountryQAList, mrzResults.issuingCountry),
      );
    }
    if (docTypeQAList.length < numberOfPreviousMRZsToCompareTo) {
      setDocTypeQAList(mrzQACheck(docTypeQAList, mrzResults.docType));
    }
    if (docExpirationDateQAList.length < numberOfPreviousMRZsToCompareTo) {
      setDocExpirationDateQAList(
        mrzQACheck(docExpirationDateQAList, mrzResults.docExpirationDate),
      );
    }
    if (additionalInformationQAList.length < numberOfPreviousMRZsToCompareTo) {
      setAdditionalInformationQAList(
        mrzQACheck(
          additionalInformationQAList,
          mrzResults.additionalInformation,
        ),
      );
    }
    if (docMRZQAList.length < 1) {
      setDocMRZQAList(mrzQACheck(docMRZQAList, mrzResults.docMRZ));
    }
    return false;
  };

  const statusCheck = (completedQAChecks: number, numOfChecks?: number) => {
    if (numOfChecks === undefined) {
      numOfChecks = numQAChecks;
    }
    if (completedQAChecks === numOfChecks) {
      return mrzFeedbackCompletedColor ?? 'rgba(53,94,59,1.0)';
    } else {
      return mrzFeedbackUncompletedColor ?? 'white';
    }
  };

  const styles = StyleSheet.create({
    feedbackContainer: {
      height: 60,
      position: 'absolute',
      top: '60%',
      backgroundColor: 'rgba(200,200,200,0.8)',
      width: '100%',
      textAlignVertical: 'center',
    },
    feedbackText: {
      color: 'white',
      fontSize: 10,
      justifyContent: 'center',
      width: '33.3%',
      textAlignVertical: 'center',
    },
    flexRow: {
      flexDirection: 'row',
      alignSelf: 'center',
      height: 30,
      justifyContent: 'flex-start',
    },
    givenNamesQAList: {
      color: statusCheck(givenNamesQAList.length),
    },
    lastNamesQAList: {
      color: statusCheck(lastNamesQAList.length),
    },

    nationalityQAList: {
      color: statusCheck(nationalityQAList.length),
    },
    idNumberQAList: {
      color: statusCheck(idNumberQAList.length),
    },
  });

  return (
    <View testID="scanDocumentView" style={StyleSheet.absoluteFill}>
      <MRZCamera
        onData={lines => {
          if (onData) {
            onData(lines);
          } else {
            const mrzResults = parseMRZ(lines);
            if (mrzResults) {
              if (currentMRZMatchesPreviousMRZs(numQAChecks, mrzResults)) {
                setScanSuccess(true);
                setIsActive(false);
                mrzFinalResults(mrzResults);
              }
            }
          }
        }}
        scanSuccess={scanSuccess}
        skipButtonText={skipButtonText}
        style={[style ? style : StyleSheet.absoluteFill]}
        skipButtonEnabled={skipButtonEnabled}
        skipButtonStyle={skipButtonStyle}
        skipButton={skipButton}
        onSkipPressed={onSkipPressed}
        cameraProps={cameraProps}
        enableBoundingBox={enableBoundingBox}
        isActiveCamera={isActiveCamera ?? isActive} // if isActiveCamera is not defined, use the internal state
      />
      {enableMRZFeedBack ? (
        <View style={[styles.feedbackContainer, mrzFeedbackContainer]}>
          <View style={styles.flexRow}>
            <Text
              style={[
                styles.feedbackText,
                styles.givenNamesQAList,
                mrzFeedbackTextStyle,
              ]}>
              {`${(languages ?? [''])[0]}  ${
                givenNamesQAList.length
              } / ${numQAChecks}`}
            </Text>
            <Text
              style={[
                styles.feedbackText,
                styles.lastNamesQAList,
                mrzFeedbackTextStyle,
              ]}>
              {`${(languages ?? [''])[1]} ${
                lastNamesQAList.length
              } / ${numQAChecks}`}
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text
              style={[
                styles.feedbackText,
                styles.nationalityQAList,
                mrzFeedbackTextStyle,
              ]}>
              {`${(languages ?? [''])[2]} ${
                nationalityQAList.length
              } / ${numQAChecks}`}
            </Text>
            <Text
              style={[
                styles.feedbackText,
                styles.idNumberQAList,
                mrzFeedbackTextStyle,
              ]}>
              {`${(languages ?? [''])[3]} ${
                idNumberQAList.length
              } / ${numQAChecks}`}
            </Text>
          </View>
        </View>
      ) : undefined}
    </View>
  );
};

export default MRZScanner;
