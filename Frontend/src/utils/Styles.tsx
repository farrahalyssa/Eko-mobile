import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#646B4B",
        width: "90%",
        padding: '4%',
        borderRadius: 100,
        marginBottom: '4%'
    },
    button:{
        backgroundColor: "#646B4B",
        width: "90%",
        borderRadius: 100,
        padding: '4%',
    },
    buttonText: {
        color: "#CFE1D0",
        marginHorizontal: "auto",
        fontSize: 20,
    },
    secondaryButton:{
        borderWidth: 1,
        borderColor: "#646B4B",
        width: "90%",
        borderRadius: 100,
        padding: '4%',
    },
    secondaryButtonText: {
        color: "#646B4B",
        marginHorizontal: "auto",
        fontSize: 20,
    },

// subtext
    subtextContainer: {
        marginTop:"2%"
    },
    subtextButton: {
        alignItems:"flex-end",
        marginBottom: "7%"
    },
    subtext: {
        color: "#646B4B",
        fontSize: 12,
    },

// divider - text in the middle
    dividerContainer: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 20 
    },
    divider: {
        flex: 1, borderBottomWidth: 1, borderBottomColor: "#646B4B", marginHorizontal: "5%"
    },

//profile
    headerImageContainer: {
        width: '100%',
        height: 150,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileSection: {
        flexDirection: 'column',
      },
    profileImageContainer: {
        marginTop: '-20%', 
        backgroundColor: '#F2F2F2',
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#F2F2F2',
        width: 125,
        height: 125,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:15
        
    },
    
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        resizeMode: 'cover',

    },
    backButton: {
        position: 'absolute',
        top: '20%',
        left: '1%',
        borderRadius: 20,
        padding: '1%',
    },

//User info
    userInfo: {
        marginTop: '5%',
    },
    bio:{
    marginTop: '10%',

    },
    dateJoined:{
    flexDirection: "row",
    marginTop: '5%',
    left: '65%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 16,
        color: '#777',
    },
    rowContainer: {
        flexDirection: "row",
        marginTop: '5%',
        justifyContent: 'space-evenly', 
    },
    rowContainer2: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
 

    
   
//Post
aboveNavFab: {
    position: 'absolute', // Fixed positioning
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#646B4B',
    justifyContent: 'center',
    alignItems: 'center',
    right: '3%',  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10,  
  },
  postContainer:{
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(128, 128, 128, 0.1)',
    padding: '3%',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',

  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: '#646B4B',
    padding: 10,
    borderRadius: 20,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
    
});