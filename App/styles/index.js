import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  allBottomIconsStyle: { width: 16, height: 16 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  WIDTH: Dimensions.get('window').width,
  HEIGHT: Dimensions.get('window').height,
  fdRow: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  mh20: { marginHorizontal: 20 },
  ph20: { paddingHorizontal: 20 },
  ph10: { paddingHorizontal: 10 },
  fsz16: { fontSize: 16 },
  white: { color: 'white' },
  box: {
    backgroundColor: 'white',
    position: 'absolute',
    width: 115,
    height: 36,
    borderRadius: 9,
    alignSelf: 'center',
  },
  fl1: { flex: 1 },
  Line: {
    width: '94%',
    alignSelf: 'center',
    backgroundColor: '#F2F2F2',
    marginVertical: 10,
    height: 1,
  },
  AllButtonContainer: {
    alignSelf: 'center',
    backgroundColor: '#EA4F3D',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FixedButon: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#EA4F3D',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AllButtonText: { color: 'white' },
  AllButtonButton: {
    width: '100%',
    height: 48,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CheckBoxImg: { width: 24, height: 24 },
  // -------------- HOME HEADER START --------------

  // -------------- CAMERA STYLES START --------------
  CameraContainer: {
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CameraCameraIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#EA4F3D',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 1,
  },
  CameraAvaIcon: {
    backgroundColor: '#C4C4C4',
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  CameraBusinessAvaIcon: {},
  // -------------- CAMERA STYLES END --------------
  headerBlock: {
    flexDirection: 'row',
    marginTop: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },

  logoStyle: {
    width: 110,
    height: 20,
  },
  // --------------- HOME HEADER END --------------

  // -------------- START COMPONENTS STYLE --------------
  HeaderComponentBlock: {
    flexDirection: 'row',
    backgroundColor: '#EA4F3D',
    minHeight: 67,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  // --------------- EDN COMPONENTS STYLE --------------

  // BottomAddStyle
  Add: { color: 'red', fontSize: 10, marginBottom: 10 },

  // Drawer Social Icons Style
  socialIconsBlock: {
    minHeight: 80,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 53,
  },
  socialIconsStyle: {
    overflow: 'hidden',
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BurgerLine: {
    height: 1,
    backgroundColor: '#E8E8E8',
    borderWidth: 0.5,
    marginTop: -10,
    marginBottom: 15,
  },
  BurgerText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  SocialShadow: {
    width: 41,
    height: 41,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    padding: 5,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },

  // --------------- PROFILE STYLES START --------------
  ProfileHeader: {
    height: 183,
    backgroundColor: '#EA4F3D',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  MyProfileText: {
    marginTop: 28,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  HeaderProfileBlock: { flexDirection: 'row', marginTop: 20 },
  ProfileHeaderAva: { alignSelf: 'center' },
  ProfileBalance: {
    minHeight: 66,
    borderWidth: 1,
    borderColor: '#EA4F3D',
    marginTop: 36,
    padding: 13,
    marginHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  ProfileReplenishText: {
    fontSize: 12,
    color: '#EA4F3D',
    marginRight: 15,
    alignSelf: 'center',
  },
  ProfileAddBlock: {
    borderRadius: 4,
    marginTop: 20,
    marginHorizontal: 20,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  ProfileAddText: {
    color: '#A7A7A7',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  // --------------- PROFILE STYLES END --------------

  // --------------- LOGIN STYLES START --------------
  RecoverText: {
    alignSelf: 'center',
    width: '90%',
    textAlign: 'center',
    marginTop: 136,
  },
  LoginIcon: {
    alignSelf: 'center',
    width: 180,
    height: 90,
    marginTop: 136,
    marginBottom: 40,
  },

  LoginIconBlock: {
    marginTop: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  LoginInputBlock: {
    alignSelf: 'center',
    width: '90%',
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    marginTop: 10,
  },
  LoginRecover: {
    color: '#8A8A8A',
    fontSize: 16,
    marginTop: 48,
    alignSelf: 'center',
  },
  LoginRegistrText: {
    color: '#EA4F3D',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  LoginSkip: { color: '#8A8A8A', alignSelf: 'center', marginVertical: 54 },
  // --------------- LOGIN STYLES END --------------

  // --------------- STATUS STYLES START --------------
  StatusUserInfoBLock: {
    width: '95%',
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#566d77',
  },
  StatusInfoName: {
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  StatusInfoAddress: { color: 'white', fontSize: 13 },
  StatusUserStatus: { marginVertical: 20, fontWeight: 'bold', fontSize: 24 },
  StatusUserStatusUpdate: { fontSize: 13, marginTop: 10 },
  QRCodeBlock: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  // --------------- STATUS STYLES END --------------

  // --------------- HOME STYLES START --------------

  HomeParametrs: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    minHeight: 50,
    marginBottom: 26,
  },
  // --------------- HOME STYLES END --------------

  // --------------- FILTER STYLES START --------------

  FilterFilterBLock: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    minHeight: 97,
    borderRadius: 10,
    marginTop: 13,
    width: '100%',
  },
  FilterInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  FilterSecondBlock: {
    width: '100%',
    height: 40,
  },
  FilterInnerButton: {
    height: 38,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --------------- FILTER STYLES END --------------
  // --------------- ADDPAGE STYLES START --------------
  AddPageTitleStyles: { fontSize: 20, fontWeight: 'bold', marginTop: 22 },
  // --------------- ADDPAGE STYLES END --------------
});

export default styles;
