import { Button } from "@mui/material"
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Submitted = () => {
  return (
    <div>
         <div className="rounded-full border-[20px] border-golden-yellow-50 cursor-pointer w-fit">
                        <div className="rounded-full border-[15px] border-golden-yellow-300">
                          <div className="text-neutrals-50 bg-golden-yellow-400 p-2 rounded-full">
                            <DoneAllIcon
                              width={"24"}
                              height={"24"}
                            />
                          </div>
                        </div>
                      </div>
        <p >Your doc has been verified</p>
        <Button variant="outlined"
        sx={{
            my:5
        }}
        >Continue</Button>

    </div>
  )
}

export default Submitted