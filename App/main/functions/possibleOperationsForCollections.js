export default (collectionType, role) => {
    if(collectionType === "tournaments"){
        if(role === "ROLE_ADMIN"){
            return ["Accept","Cancel","Ban","Unlock","Delete"];
        }
        else if(role === "ROLE_ORGANIZER"){
            return ["Add","Report"];
        }
        else if(role === "ROLE_ACCEPTED"){
            return ["Report"];
        }
    }
    else if(collectionType === "users"){
        if(role === "ROLE_ADMIN"){
            return ["Accept","Cancel","Ban","Unlock","Advance","Degrade","Delete"];
        }
        else if(role === "ROLE_ORGANIZER"){
            return ["Report"];
        }
        else if(role === "ROLE_ACCEPTED"){
            return ["Report"];
        }
    }
    else if(collectionType === "games"){
        if(role === "ROLE_ADMIN"){
            return ["Accept","Cancel","Ban","Unlock","Delete","Add"];
        }
        else if(role === "ROLE_ORGANIZER"){
            return ["Add","Report"];
        }
        else if(role === "ROLE_ACCEPTED"){
            return ["Report"];
        }
    }
};