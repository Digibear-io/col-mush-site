

export const Close = ({ color = "white", ...props }) =><div {...props} >
    <svg width="100%" height="100%" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.770301" y1="1.0107" x2="17.7693" y2="18.0098" stroke={color}/>
        <line x1="1.60534" y1="18.0097" x2="18.6044" y2="1.01068" stroke={color}/>
    </svg>
</div> 


export const DownArrow = ({color="white"}) => <svg width="16" height="8"  viewBox="0 0 16 8"  xmlns="http://www.w3.org/2000/svg">
    <path d="M0.469666 0.821289L7.84184 6.82129L11.5279 3.82129L15.2139 0.821289" stroke={color} />
</svg>

export const Menu = ({color="white"}) => <svg width="25" height="18" viewBox="0 0 25 18" fill={color} xmlns="http://www.w3.org/2000/svg">
<line x1="0.5" y1="1.34985" x2="24.5" y2="1.34986" stroke="white"/>
<line x1="0.5" y1="9.34985" x2="24.5" y2="9.34986" stroke="white"/>
<line x1="0.5" y1="17.3499" x2="24.5" y2="17.3499" stroke="white"/>
</svg>

