import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 100,
  },
  buttonInactive: {
    backgroundColor: '#4D41CB',
  },
  buttonActive: {
    backgroundColor: '#6A5ACD',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  arrowIcon: {
    width: 23,
    height: 23,
    tintColor: '#FFFFFF',
  },
});
